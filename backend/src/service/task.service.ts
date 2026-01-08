import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCreateRequestDto } from 'src/dto/task-create-request.dto';
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
  async create(taskCreateRequestDto: TaskCreateRequestDto) {
    const task = this.taskRepository.create(taskCreateRequestDto);
    console.log('task', task);
    console.log('taskCreateRequestDto', taskCreateRequestDto);
    await this.taskRepository.save(task);
    return task.id;
  }
}
