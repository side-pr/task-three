import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Matches } from 'class-validator';

export class ScheduleDetailResponse {
  @ApiProperty({ description: '스케줄 ID' })
  @IsNumber()
  scheduleId: number;

  @ApiProperty({ description: '할 일 ID' })
  @IsNumber()
  taskId: number;

  @ApiProperty({ description: '할 일 이름' })
  name: string;

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

  constructor(
    scheduleId: number,
    taskId: number,
    name: string,
    startTime: string,
    endTime: string,
  ) {
    this.scheduleId = scheduleId;
    this.taskId = taskId;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
