import { ApiProperty } from '@nestjs/swagger';

export class ScheduleItemResponse {
  @ApiProperty({ description: '스케줄 ID', example: 1 })
  scheduleId: number;

  @ApiProperty({ description: '할 일 ID', example: 1 })
  taskId: number;

  @ApiProperty({ description: '할 일 이름', example: '프로젝트 회의' })
  taskName: string;

  @ApiProperty({ description: '시작 시간', example: '09:00:00' })
  startTime: string;

  @ApiProperty({ description: '종료 시간', example: '10:00:00' })
  endTime: string;

  @ApiProperty({ description: '대상 날짜', example: '2026-01-18' })
  targetDate: string;

  @ApiProperty({ description: '완료 여부', example: false })
  isCompleted: boolean;

  constructor(
    scheduleId: number,
    taskId: number,
    taskName: string,
    startTime: string,
    endTime: string,
    targetDate: string,
    isCompleted: boolean,
  ) {
    this.scheduleId = scheduleId;
    this.taskId = taskId;
    this.taskName = taskName;
    this.startTime = startTime;
    this.endTime = endTime;
    this.targetDate = targetDate;
    this.isCompleted = isCompleted;
  }
}

export class ScheduleListResponse {
  @ApiProperty({ description: '스케줄 목록', type: [ScheduleItemResponse] })
  schedules: ScheduleItemResponse[];

  constructor(schedules: ScheduleItemResponse[]) {
    this.schedules = schedules;
  }
}
