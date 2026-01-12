import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TaskUpdateRequest {
  @ApiProperty({ description: '할일 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
