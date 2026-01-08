import { ApiProperty } from '@nestjs/swagger';

export class TaskCreateRequestDto {
  @ApiProperty({ description: '할일 이름' })
  name: string;
}
