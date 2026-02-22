import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCreateRequest } from 'src/dto/task-create-request.dto';
import { TaskUpdateRequest } from 'src/dto/task-update-request.dto';
import { TaskDetailResponse } from 'src/dto/task-detail-response.dto';
import {
  TaskItemResponse,
  TaskListResponse,
} from 'src/dto/task-list-response.dto';
import { Member } from 'src/entities/member.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { Task } from 'src/entities/task.entity';
import { Repository, LessThanOrEqual } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(date: string, member?: Member): Promise<TaskListResponse> {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    let tasks: Task[];

    if (isToday) {
      // 오늘 조회: 오늘 이전의 미완료 task + 오늘 task
      const memberCondition = member ? { member: { id: member.id } } : {};

      // 과거 미완료 task
      const pastUncompletedTasks = await this.taskRepository.find({
        where: {
          targetDate: LessThanOrEqual(today),
          isCompleted: false,
          ...memberCondition,
        },
        order: { createdAt: 'DESC' },
      });

      // 오늘 완료된 task
      const todayCompletedTasks = await this.taskRepository.find({
        where: {
          targetDate: today,
          isCompleted: true,
          ...memberCondition,
        },
        order: { createdAt: 'DESC' },
      });

      // 중복 제거하여 합치기
      const taskIds = new Set<number>();
      tasks = [...pastUncompletedTasks, ...todayCompletedTasks].filter(
        (task) => {
          if (taskIds.has(task.id)) return false;
          taskIds.add(task.id);
          return true;
        },
      );
    } else {
      // 다른 날짜: 해당 날짜의 task만 조회
      tasks = await this.taskRepository.find({
        where: {
          targetDate: date,
          ...(member ? { member: { id: member.id } } : {}),
        },
        order: { createdAt: 'DESC' },
      });
    }

    // 해당 날짜의 schedule에 연결된 task id 목록
    const schedules = await this.scheduleRepository.find({
      relations: ['task'],
      where: {
        targetDate: date,
        ...(member ? { member: { id: member.id } } : {}),
      },
    });

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

  async create(taskCreateRequestDto: TaskCreateRequest, member?: Member) {
    const task = this.taskRepository.create({
      ...taskCreateRequestDto,
      member: member || null,
    });
    const savedTask = await this.taskRepository.save(task);
    return savedTask.id;
  }

  async updateContent(
    taskId: number,
    taskUpdateRequestDto: TaskUpdateRequest,
    member?: Member,
  ): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['member'],
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    if (member && task.member?.id !== member.id) {
      throw new ForbiddenException('해당 할 일을 수정할 권한이 없습니다.');
    }
    task.name = taskUpdateRequestDto.name;
    await this.taskRepository.save(task);
  }

  async getDetail(
    taskId: number,
    member?: Member,
  ): Promise<TaskDetailResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['member'],
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    if (member && task.member?.id !== member.id) {
      throw new ForbiddenException('해당 할 일을 조회할 권한이 없습니다.');
    }
    return new TaskDetailResponse(task.id, task.name);
  }

  async delete(taskId: number, member?: Member): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['member'],
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    if (member && task.member?.id !== member.id) {
      throw new ForbiddenException('해당 할 일을 삭제할 권한이 없습니다.');
    }
    await this.taskRepository.delete(taskId);
  }

  async complete(taskId: number, member?: Member): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['member'],
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    if (member && task.member?.id !== member.id) {
      throw new ForbiddenException('해당 할 일을 완료할 권한이 없습니다.');
    }
    task.isCompleted = true;
    task.completedAt = new Date().toISOString().split('T')[0];
    await this.taskRepository.save(task);
  }

  async cancelComplete(taskId: number, member?: Member): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['member'],
    });
    if (!task) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }
    if (member && task.member?.id !== member.id) {
      throw new ForbiddenException(
        '해당 할 일의 완료를 취소할 권한이 없습니다.',
      );
    }
    task.isCompleted = false;
    task.completedAt = null;
    await this.taskRepository.save(task);
  }
}
