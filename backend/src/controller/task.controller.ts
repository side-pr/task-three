import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { TaskResponseDto, UpdateTaskDto } from 'src/dto/task.dto';

@Controller('tasks')
export class TaskController {
  @Get()
  getTasks(): Promise<TaskResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
