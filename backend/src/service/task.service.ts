import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCreateRequest } from 'src/dto/task-create-request.dto';
import { TaskDetailResponse } from 'src/dto/task-detail-response.dto';
import {
  TaskItemResponse,
  TaskListResponse,
} from 'src/dto/task-list-response.dto';
import { Schedule } from 'src/entities/schedule.entity';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<TaskListResponse> {
    const tasks = await this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    const schedules = await this.scheduleRepository.find({
      relations: ['task'],
    });

    // schedule에 연결된 task id 목록
    const scheduledTaskIds = schedules
      .filter((schedule) => schedule.task !== null)
      .map((schedule) => schedule.task!.id);

    // schedule에 없는 task만 필터링
    const filteredTasks = tasks.filter(
      (task) => !scheduledTaskIds.includes(task.id),
    );

    const taskItems = filteredTasks.map(
      (task) => new TaskItemResponse(task.id, task.name, task.isCompleted),
    );

    return new TaskListResponse(taskItems);
  }

  async create(taskCreateRequestDto: TaskCreateRequest) {
    const task = this.taskRepository.create(taskCreateRequestDto);
    const savedTask = await this.taskRepository.save(task);
    return savedTask.id;
  }

  async updateContent(
    taskId: number,
    taskCreateRequestDto: TaskCreateRequest,
  ): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    task.name = taskCreateRequestDto.name;
    await this.taskRepository.save(task);
  }

  async getDetail(taskId: number): Promise<TaskDetailResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    return new TaskDetailResponse(task.id, task.name);
  }

  async delete(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    await this.taskRepository.delete(taskId);
  }

  async complete(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    task.isCompleted = true;
    await this.taskRepository.save(task);
  }

  async cancelComplete(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    task.isCompleted = false;
    await this.taskRepository.save(task);
  }
}
