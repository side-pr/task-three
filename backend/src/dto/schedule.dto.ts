export class ScheduleResponseDto {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  targetDate: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateScheduleDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  targetDate?: string;
  order?: number;
}
