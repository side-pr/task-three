import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class TaskCreateRequest {
  @ApiProperty({ description: '할일 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '목표 날짜 (YYYY-MM-DD)', example: '2026-01-28' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'YYYY-MM-DD 형식이어야 합니다' })
  targetDate: string;
}
