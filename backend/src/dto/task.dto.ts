import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ description: 'Task ID' })
  id: string;

  @ApiProperty({ description: 'Task name' })
  name: string;

  @ApiProperty({ description: 'Start time', example: '09:00:00' })
  startTime: string;

  @ApiProperty({ description: 'End time', example: '17:00:00' })
  endTime: string;

  @ApiProperty({ description: 'Completion status' })
  isCompleted: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class UpdateTaskDto {
  @ApiProperty({ description: 'Task name', required: false })
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

  @ApiProperty({ description: 'Completion status', required: false })
  isCompleted?: boolean;
}
