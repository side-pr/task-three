import { Body, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleResponseDto, UpdateScheduleDto } from 'src/dto/schedule.dto';

@ApiTags('schedules')
export abstract class ScheduleControllerDocs {
  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({
    status: 200,
    description: 'Return all schedules',
    type: [ScheduleResponseDto],
  })
  getSchedules(): Promise<ScheduleResponseDto[]> {
    throw new Error('Method not implemented');
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
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    throw new Error('Method not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  deleteSchedule(@Param('id') id: string): Promise<void> {
    throw new Error('Method not implemented');
  }
}
