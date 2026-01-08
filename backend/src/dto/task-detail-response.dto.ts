import { ApiProperty } from '@nestjs/swagger';

export class TaskDetailResponse {
  @ApiProperty({ description: '할 일 ID' })
  taskId: number;

  @ApiProperty({ description: '할 일 이름' })
  name: string;

  constructor(taskId: number, name: string) {
    this.taskId = taskId;
    this.name = name;
  }
}
