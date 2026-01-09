import {
  Controller,
  HttpStatus,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceApiResponse } from 'src/config/api-response';
import { ScheduleCreateRequest } from 'src/dto/schedule-create-request.dto';
import { ScheduleService } from 'src/service/schedule.service';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

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
}
