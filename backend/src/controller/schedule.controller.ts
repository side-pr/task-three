import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ScheduleResponseDto, UpdateScheduleDto } from 'src/dto/schedule.dto';
import { Body, Delete, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
