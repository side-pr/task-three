import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleCreateRequest } from 'src/dto/schedule-create-request.dto';
import { ScheduleDetailResponse } from 'src/dto/schedule-detail-response.dto';
import {
  ScheduleItemResponse,
  ScheduleListResponse,
} from 'src/dto/schedule-list-response.dto';
import { Schedule } from 'src/entities/schedule.entity';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<ScheduleListResponse> {
    const schedules = await this.scheduleRepository.find({
      relations: ['task'],
      order: {
        targetDate: 'ASC',
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

  async create(scheduleCreateRequest: ScheduleCreateRequest): Promise<number> {
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

    const { taskId, ...scheduleData } = scheduleCreateRequest;

    // taskId로 Task 조회
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
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
