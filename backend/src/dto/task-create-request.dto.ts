import { ApiProperty } from '@nestjs/swagger';

export class TaskCreateRequest {
  @ApiProperty({ description: '할일 이름' })
  name: string;
}
