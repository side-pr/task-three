import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCreateRequest } from 'src/dto/task-create-request.dto';
import { TaskDetailResponse } from 'src/dto/task-detail-response.dto';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // async findAll(date: Date): Promise<Task[]> {
  //   const tasks = await this.taskRepository.find({
  //     where: {
  //       targetDate: date,
  //     },
  //   });
  //   //해당 날짜의 스케줄이 있는 태스크를 조회
  //   //오늘이면 isCompleted가 false인 태스크를 조회 + 오늘 완료한 태스크 조회
  //   //오늘이 아니면 해당 날짜에 완료한 태스크를 조회
  //   console.log(tasks);
  //   return [];
  // }

  async create(taskCreateRequestDto: TaskCreateRequest) {
    const task = this.taskRepository.create(taskCreateRequestDto);
    console.log('task', task);
    console.log('taskCreateRequestDto', taskCreateRequestDto);
    const savedTask = await this.taskRepository.save(task);
    return savedTask.id;
  }

  async getTaskDetail(taskId: number): Promise<TaskDetailResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    return new TaskDetailResponse(task.id, task.name);
  }

  async deleteTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    await this.taskRepository.delete(taskId);
  }
}
