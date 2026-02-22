import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleCreateRequest } from 'src/dto/schedule-create-request.dto';
import { ScheduleDetailResponse } from 'src/dto/schedule-detail-response.dto';
import {
  ScheduleItemResponse,
  ScheduleListResponse,
} from 'src/dto/schedule-list-response.dto';
import { Member } from 'src/entities/member.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { Task } from 'src/entities/task.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(date: string, member?: Member): Promise<ScheduleListResponse> {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    const memberCondition = member ? { member: { id: member.id } } : {};

    let schedules: Schedule[];

    if (isToday) {
      // 오늘 조회: 과거~오늘의 미완료 스케줄 + 오늘 완료된 스케줄
      const pastUncompletedSchedules = await this.scheduleRepository.find({
        relations: ['task'],
        where: {
          targetDate: LessThanOrEqual(today),
          isCompleted: false,
          ...memberCondition,
        },
        order: { startTime: 'ASC' },
      });

      const todayCompletedSchedules = await this.scheduleRepository.find({
        relations: ['task'],
        where: {
          targetDate: today,
          isCompleted: true,
          ...memberCondition,
        },
        order: { startTime: 'ASC' },
      });

      // 중복 제거하여 합치기
      const scheduleIds = new Set<number>();
      schedules = [
        ...pastUncompletedSchedules,
        ...todayCompletedSchedules,
      ].filter((schedule) => {
        if (scheduleIds.has(schedule.id)) return false;
        scheduleIds.add(schedule.id);
        return true;
      });

      // 시작 시간순 정렬
      schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
    } else {
      // 다른 날짜: 해당 날짜의 스케줄 조회
      schedules = await this.scheduleRepository.find({
        relations: ['task'],
        where: {
          targetDate: date,
          ...memberCondition,
        },
        order: { startTime: 'ASC' },
      });
    }

    const scheduleItems = schedules.map(
      (schedule) =>
        new ScheduleItemResponse(
          schedule.id,
          schedule.task?.id || 0,
          schedule.task?.name || '',
          schedule.startTime,
          schedule.endTime,
          schedule.targetDate,
          schedule.isCompleted,
        ),
    );

    return new ScheduleListResponse(scheduleItems);
  }

  async create(
    scheduleCreateRequest: ScheduleCreateRequest,
    member?: Member,
  ): Promise<number> {
    const { taskId, ...scheduleData } = scheduleCreateRequest;

    // taskId로 Task 조회
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    // Schedule 생성 시 Task 객체 연결
    const schedule = this.scheduleRepository.create({
      ...scheduleData,
      task,
      member: member || null,
    });

    const savedSchedule = await this.scheduleRepository.save(schedule);
    return savedSchedule.id;
  }

  async update(
    scheduleId: number,
    scheduleCreateRequest: ScheduleCreateRequest,
    member?: Member,
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }

    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException('해당 스케줄을 수정할 권한이 없습니다.');
    }

    const { taskId, name, ...scheduleData } = scheduleCreateRequest;

    // taskId로 Task 조회
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    // Task 이름 업데이트 (name이 제공된 경우)
    if (name) {
      task.name = name;
      await this.taskRepository.save(task);
    }

    // Schedule 업데이트
    Object.assign(schedule, {
      ...scheduleData,
      task,
    });

    await this.scheduleRepository.save(schedule);
  }

  async getDetail(
    scheduleId: number,
    member?: Member,
  ): Promise<ScheduleDetailResponse> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member', 'task'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }
    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException('해당 스케줄을 조회할 권한이 없습니다.');
    }
    const task = await this.taskRepository.findOne({
      where: { id: schedule.task?.id },
    });
    if (!task) {
      throw new NotFoundException(
        `Task with id ${schedule.task?.id} not found`,
      );
    }

    return new ScheduleDetailResponse(
      schedule.id,
      task.id,
      task.name,
      schedule.startTime,
      schedule.endTime,
    );
  }

  async moveToTodoList(scheduleId: number, member?: Member): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }

    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException('해당 스케줄을 이동할 권한이 없습니다.');
    }

    await this.scheduleRepository.remove(schedule);
  }
  async complete(scheduleId: number, member?: Member): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }

    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException('해당 스케줄을 완료할 권한이 없습니다.');
    }

    schedule.isCompleted = true;
    schedule.completedAt = new Date().toISOString().split('T')[0];
    await this.scheduleRepository.save(schedule);
  }

  async cancelComplete(scheduleId: number, member?: Member): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member'],
    });
    if (!schedule) {
      throw new NotFoundException('스케줄을 찾을 수 없습니다.');
    }
    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException(
        '해당 스케줄의 완료를 취소할 권한이 없습니다.',
      );
    }
    schedule.isCompleted = false;
    schedule.completedAt = null;
    await this.scheduleRepository.save(schedule);
  }

  async delete(scheduleId: number, member?: Member): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['member', 'task'],
    });
    if (!schedule) {
      throw new NotFoundException('스케줄을 찾을 수 없습니다.');
    }
    if (member && schedule.member?.id !== member.id) {
      throw new ForbiddenException('해당 스케줄을 삭제할 권한이 없습니다.');
    }
    const task = await this.taskRepository.findOne({
      where: { id: schedule.task?.id },
    });
    if (!task) {
      throw new NotFoundException(
        'Task with id ${schedule.task?.id} not found',
      );
    }

    await this.taskRepository.remove(task);
    await this.scheduleRepository.remove(schedule);
  }
}
