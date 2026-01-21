import { Controller, Delete, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from 'src/service/task.service';
import { TaskCreateRequest } from 'src/dto/task-create-request.dto';
import { ServiceApiResponse } from 'src/config/api-response';
import { TaskDetailResponse } from 'src/dto/task-detail-response.dto';
import { TaskUpdateRequest } from 'src/dto/task-update-request.dto';
import { TaskCreateResponse } from 'src/dto/task-create-response.dto';
import { TaskListResponse } from 'src/dto/task-list-response.dto';

@Controller('api/tasks')
@ApiTags('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: '할 일 목록 조회' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: '조회 날짜 (YYYY-MM-DD)',
    example: '2026-01-21',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 목록 조회 성공',
    type: TaskListResponse,
  })
  async findAll(
    @Query('date') date: string,
  ): Promise<ServiceApiResponse<TaskListResponse>> {
    const taskListResponse = await this.taskService.findAll(date);
    return ServiceApiResponse.success(HttpStatus.OK, taskListResponse);
  }

  @Post()
  @ApiOperation({ summary: '할 일 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '할 일 생성 성공',
    type: TaskCreateResponse,
  })
  async create(
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
    type: ServiceApiResponse<TaskDetailResponse>,
  })
  async getDetail(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<TaskDetailResponse>> {
    const taskDetailResponse = await this.taskService.getDetail(taskId);
    return ServiceApiResponse.success(HttpStatus.OK, taskDetailResponse);
  }

  @Put(':taskId')
  @ApiOperation({ summary: '할 일 수정' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 수정 성공',
  })
  async updateContent(
    @Param('taskId') taskId: number,
    @Body() taskUpdateRequestDto: TaskUpdateRequest,
  ): Promise<ServiceApiResponse<{ taskId: number }>> {
    await this.taskService.updateContent(taskId, taskUpdateRequestDto);
    return ServiceApiResponse.success(HttpStatus.CREATED, { taskId });
  }

  @Put(':taskId/complete')
  @ApiOperation({ summary: '할 일 완료' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 완료 성공',
  })
  async complete(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<{ taskId: number }>> {
    await this.taskService.complete(taskId);
    return ServiceApiResponse.success(HttpStatus.OK);
  }

  @Put(':taskId/cancel-complete')
  @ApiOperation({ summary: '할 일 완료 취소' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 완료 취소 성공',
  })
  async cancelComplete(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<{ taskId: number }>> {
    await this.taskService.cancelComplete(taskId);
    return ServiceApiResponse.success(HttpStatus.OK);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: '할 일 삭제' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '할 일 삭제 성공',
  })
  async delete(
    @Param('taskId') taskId: number,
  ): Promise<ServiceApiResponse<void>> {
    await this.taskService.delete(taskId);
    return ServiceApiResponse.success(HttpStatus.NO_CONTENT, null);
  }
}
