import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseDto {
  @ApiProperty({ description: 'Schedule ID' })
  id: string;

  @ApiProperty({ description: 'Schedule name' })
  name: string;

  @ApiProperty({ description: 'Start time', example: '09:00:00' })
  startTime: string;

  @ApiProperty({ description: 'End time', example: '17:00:00' })
  endTime: string;

  @ApiProperty({ description: 'Target date', example: '2026-01-08' })
  targetDate: string;

  @ApiProperty({ description: 'Display order' })
  order: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Schedule name', required: false })
  name?: string;

  @ApiProperty({
    description: 'Start time',
    example: '09:00:00',
    required: false,
  })
  startTime?: string;

  @ApiProperty({
    description: 'End time',
    example: '17:00:00',
    required: false,
  })
  endTime?: string;

  @ApiProperty({
    description: 'Target date',
    example: '2026-01-08',
    required: false,
  })
  targetDate?: string;

  @ApiProperty({ description: 'Display order', required: false })
  order?: number;
}
