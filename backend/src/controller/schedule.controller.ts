import { Controller } from '@nestjs/common';
import { ScheduleResponseDto, UpdateScheduleDto } from 'src/dto/schedule.dto';
import { Body, Delete, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({
    status: 200,
    description: 'Return all schedules',
    type: [ScheduleResponseDto],
  })
  getSchedules(): Promise<ScheduleResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Schedule updated successfully',
    type: ScheduleResponseDto,
  })
  updateSchedule(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  deleteSchedule(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
