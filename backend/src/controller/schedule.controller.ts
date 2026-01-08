import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ScheduleResponseDto, UpdateScheduleDto } from 'src/dto/schedule.dto';

@Controller('schedules')
export class ScheduleController {
  @Get()
  getSchedules(): Promise<ScheduleResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Patch(':id')
  updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  @Delete(':id')
  deleteSchedule(@Param('id') id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
