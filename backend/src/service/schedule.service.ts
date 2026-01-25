import { Injectable, NotFoundException } from '@nestjs/common';
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
import { LessThan, Repository } from 'typeorm';

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

    // 지난 날짜의 미완료 Schedule 삭제 (Task는 유지)
    await this.scheduleRepository.delete({
      targetDate: LessThan(today),
      isCompleted: false,
    });

    const isToday = date === today;

    if (isToday) {
      // 오늘이면 오늘 Schedule 조회
      const schedules = await this.scheduleRepository.find({
        relations: ['task'],
        where: {
          targetDate: today,
          ...(member ? { member: { id: member.id } } : {}),
        },
        order: {
          startTime: 'ASC',
        },
      });

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

    // 오늘이 아니면 해당 날짜에 완료된 schedule만 조회
    const schedules = await this.scheduleRepository.find({
      relations: ['task'],
      where: {
        completedAt: date,
        ...(member ? { member: { id: member.id } } : {}),
      },
      order: {
        startTime: 'ASC',
      },
    });

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
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
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

  async getDetail(scheduleId: number): Promise<ScheduleDetailResponse> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });
    //상세조회부터
    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
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

  async moveToTodoList(scheduleId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }

    await this.scheduleRepository.remove(schedule);
  }
  async complete(scheduleId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${scheduleId} not found`);
    }

    schedule.isCompleted = true;
    schedule.completedAt = new Date().toISOString().split('T')[0];
    await this.scheduleRepository.save(schedule);
  }

  async cancelComplete(scheduleId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException('스케줄을 찾을 수 없습니다.');
    }
    schedule.isCompleted = false;
    schedule.completedAt = null;
    await this.scheduleRepository.save(schedule);
  }

  async delete(scheduleId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException('스케줄을 찾을 수 없습니다.');
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
