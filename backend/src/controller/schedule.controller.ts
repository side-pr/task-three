import {
  Controller,
  HttpStatus,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceApiResponse } from 'src/config/api-response';
import { ScheduleCreateRequest } from 'src/dto/schedule-create-request.dto';
import { ScheduleDetailResponse } from 'src/dto/schedule-detail-response.dto';
import { ScheduleService } from 'src/service/schedule.service';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get(':taskId')
  @ApiOperation({ summary: '할 일 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 상세 조회 성공',
    type: ServiceApiResponse<ScheduleDetailResponse>,
  })
  async getDetail(
    @Param('scheduleId') scheduleId: number,
  ): Promise<ServiceApiResponse<ScheduleDetailResponse>> {
    const scheduleDetailResponse =
      await this.scheduleService.getDetail(scheduleId);
    return ServiceApiResponse.success(HttpStatus.OK, scheduleDetailResponse);
  }

  @Post()
  @ApiOperation({ summary: '스케줄 등록' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '스케줄 등록 성공',
    type: ServiceApiResponse<{ scheduleId: number }>,
  })
  async createSchedule(
    @Body() scheduleCreateRequest: ScheduleCreateRequest,
  ): Promise<ServiceApiResponse<{ scheduleId: number }>> {
    const scheduleId = await this.scheduleService.create(scheduleCreateRequest);
    return ServiceApiResponse.success(HttpStatus.CREATED, { scheduleId });
  }

  @Put(':scheduleId')
  @ApiOperation({ summary: '스케줄 내용 수정' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '스케줄 수정 성공',
    type: ServiceApiResponse<{ scheduleId: number }>,
  })
  async updateSchedule(
    @Body() scheduleCreateRequest: ScheduleCreateRequest,
  ): Promise<ServiceApiResponse<{ scheduleId: number }>> {
    const scheduleId = await this.scheduleService.create(scheduleCreateRequest);
    return ServiceApiResponse.success(HttpStatus.CREATED, { scheduleId });
  }

  @Put(':scheduleId')
  @ApiOperation({ summary: '스케줄 완료' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '스케줄 완료 성공',
  })
  async completeSchedule(
    @Param('scheduleId') scheduleId: number,
  ): Promise<ServiceApiResponse<{ scheduleId: number }>> {
    await this.scheduleService.complete(scheduleId);
    return ServiceApiResponse.success(HttpStatus.OK);
  }

  @Delete(':scheduleId')
  @ApiOperation({ summary: '스케줄을 할일 목록으로 이동' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '스케줄을 할일 목록으로 이동 성공',
  })
  async moveToTaskList(
    @Param('scheduleId') scheduleId: number,
  ): Promise<ServiceApiResponse<void>> {
    await this.scheduleService.moveToTaskList(scheduleId);
    return ServiceApiResponse.success(HttpStatus.NO_CONTENT, null);
  }

  @Delete(':scheduleId')
  @ApiOperation({ summary: '스케줄 완료 취소' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '스케줄 완료 취소 성공',
  })
  async cancelComplete(
    @Param('scheduleId') scheduleId: number,
  ): Promise<ServiceApiResponse<{ scheduleId: number }>> {
    await this.scheduleService.cancelComplete(scheduleId);
    return ServiceApiResponse.success(HttpStatus.OK);
  }
}
