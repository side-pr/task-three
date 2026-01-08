import { Controller, HttpStatus } from '@nestjs/common';
import { TaskResponseDto, UpdateTaskDto } from 'src/dto/task.dto';
import { Body, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all tasks',
    type: [TaskResponseDto],
  })
  getTasks(): Promise<TaskResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted successfully',
  })
  deleteTask(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
