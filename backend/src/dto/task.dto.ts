export class TaskResponseDto {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateTaskDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  isCompleted?: boolean;
}
