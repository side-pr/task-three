import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleCreateRequest } from 'src/dto/schedule-create-request.dto';
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
}
