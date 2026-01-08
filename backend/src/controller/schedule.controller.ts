import { Controller } from '@nestjs/common';
import { ScheduleControllerDocs } from './docs/schedule.controller.docs';
import { ScheduleResponseDto, UpdateScheduleDto } from 'src/dto/schedule.dto';

@Controller('schedules')
export class ScheduleController extends ScheduleControllerDocs {
  getSchedules(): Promise<ScheduleResponseDto[]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  updateSchedule(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  deleteSchedule(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
