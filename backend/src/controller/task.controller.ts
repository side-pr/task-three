import { Controller, HttpStatus, Post } from '@nestjs/common';
import { Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from 'src/service/task.service';
import { TaskCreateRequest } from 'src/dto/task-create-request.dto';
import { ServiceApiResponse } from 'src/config/api-response';
import { TaskDetailResponse } from 'src/dto/task-detail-response.dto';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: '할 일 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 생성 성공',
    type: ServiceApiResponse<{ taskId: number }>,
  })
  async createTask(
    @Body() taskCreateRequestDto: TaskCreateRequest,
  ): Promise<ServiceApiResponse<{ taskId: number }>> {
    const taskId = await this.taskService.create(taskCreateRequestDto);
    return ServiceApiResponse.success(HttpStatus.CREATED, { taskId });
  }

  @Get(':taskId')
  @ApiOperation({ summary: '할 일 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 상세 조회 성공',
  })
  async getTaskDetail(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<TaskDetailResponse>> {
    const taskDetailResponse = await this.taskService.getTaskDetail(taskId);
    return ServiceApiResponse.success(HttpStatus.OK, taskDetailResponse);
  }

  @Get(':taskId')
  @ApiOperation({ summary: '할 일 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 상세 조회 성공',
  })
  async deleteTask(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<void>> {
    await this.taskService.deleteTask(taskId);
    return ServiceApiResponse.success(HttpStatus.NO_CONTENT, null);
  }
}
