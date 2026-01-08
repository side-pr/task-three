import { Controller } from '@nestjs/common';
import { TaskControllerDocs } from './docs/task.controller.docs';
import { TaskResponseDto, UpdateTaskDto } from 'src/dto/task.dto';

@Controller('tasks')
export class TaskController extends TaskControllerDocs {
  getTasks(): Promise<TaskResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  deleteTask(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
