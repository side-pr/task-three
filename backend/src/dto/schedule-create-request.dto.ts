import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Matches } from 'class-validator';

export class ScheduleCreateRequest {
  @ApiProperty({ description: '할 일 ID' })
  @IsNumber()
  taskId: number;

  @ApiProperty({ description: '스케줄 시작 시간', example: '08:00:00' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM:SS format',
  })
  startTime: string;

  @ApiProperty({ description: '스케줄 끝낼 시간', example: '18:00:00' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM:SS format',
  })
  endTime: string;

  @ApiProperty({ description: '스케줄 대상 날짜', example: '2026-01-08' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'targetDate must be in YYYY-MM-DD format',
  })
  targetDate: string;
}
