import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TaskCreateRequest {
  @ApiProperty({ description: '할일 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
