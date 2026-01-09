import { ApiProperty } from '@nestjs/swagger';

export class TaskUpdateRequest {
  @ApiProperty({ description: '할일 이름' })
  name: string;
}
