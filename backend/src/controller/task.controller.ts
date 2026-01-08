import { Controller, HttpStatus, Post } from '@nestjs/common';
import { TaskResponseDto, UpdateTaskDto } from 'src/dto/task.dto';
import { Body, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from 'src/service/task.service';
import { TaskCreateRequestDto } from 'src/dto/task-create-request.dto';
import { ServiceApiResponse } from 'src/config/api-response';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: '할 일 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  async createTask(
    @Body() taskCreateRequestDto: TaskCreateRequestDto,
  ): Promise<ServiceApiResponse<{ taskId: number }>> {
    const taskId = await this.taskService.create(taskCreateRequestDto);
    return ServiceApiResponse.success(HttpStatus.CREATED, { taskId });
  }
}
