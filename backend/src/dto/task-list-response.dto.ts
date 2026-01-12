import { ApiProperty } from '@nestjs/swagger';

export class TaskItemResponse {
  @ApiProperty({ description: '할 일 ID', example: 1 })
  taskId: number;

  @ApiProperty({ description: '할 일 이름', example: '프로젝트 회의' })
  name: string;

  @ApiProperty({ description: '완료 여부', example: false })
  isCompleted: boolean;

  constructor(taskId: number, name: string, isCompleted: boolean) {
    this.taskId = taskId;
    this.name = name;
    this.isCompleted = isCompleted;
  }
}

export class TaskListResponse {
  @ApiProperty({ description: '할 일 목록', type: [TaskItemResponse] })
  tasks: TaskItemResponse[];

  constructor(tasks: TaskItemResponse[]) {
    this.tasks = tasks;
  }
}
