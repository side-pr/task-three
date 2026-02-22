import { ApiProperty } from '@nestjs/swagger';

export class DailyStatsResponse {
  @ApiProperty({ description: '전체 할 일 수', example: 5 })
  taskTotal: number;

  @ApiProperty({ description: '완료된 할 일 수', example: 3 })
  taskCompleted: number;

  @ApiProperty({ description: '할 일 완료율 (%)', example: 60 })
  taskCompletionRate: number;

  @ApiProperty({ description: '전체 스케줄 수', example: 3 })
  scheduleTotal: number;

  @ApiProperty({ description: '완료된 스케줄 수', example: 2 })
  scheduleCompleted: number;

  @ApiProperty({ description: '스케줄 완료율 (%)', example: 66.7 })
  scheduleCompletionRate: number;

  constructor(
    taskTotal: number,
    taskCompleted: number,
    scheduleTotal: number,
    scheduleCompleted: number,
  ) {
    this.taskTotal = taskTotal;
    this.taskCompleted = taskCompleted;
    this.taskCompletionRate =
      taskTotal > 0 ? Math.round((taskCompleted / taskTotal) * 1000) / 10 : 0;
    this.scheduleTotal = scheduleTotal;
    this.scheduleCompleted = scheduleCompleted;
    this.scheduleCompletionRate =
      scheduleTotal > 0
        ? Math.round((scheduleCompleted / scheduleTotal) * 1000) / 10
        : 0;
  }
}

export class CohortCellResponse {
  @ApiProperty({ description: 'task 등록 수', example: 5 })
  taskRegistered: number;

  @ApiProperty({ description: 'task 완료 수', example: 3 })
  taskCompleted: number;

  @ApiProperty({ description: 'schedule 등록 수', example: 2 })
  scheduleRegistered: number;

  @ApiProperty({ description: 'schedule 완료 수', example: 1 })
  scheduleCompleted: number;
}

export class CohortRowResponse {
  @ApiProperty({ description: '코호트 날짜 (가입일)', example: '2026-02-20' })
  date: string;

  @ApiProperty({ description: '해당 날짜 가입 유저 수', example: 3 })
  memberCount: number;

  @ApiProperty({
    description: 'Day0, Day1, Day2, ... 별 활동 데이터',
    type: [CohortCellResponse],
  })
  days: CohortCellResponse[];
}

export class MemberCohortRowResponse {
  @ApiProperty({ description: '멤버 라벨', example: 'M1' })
  label: string;

  @ApiProperty({ description: '가입일', example: '2026-02-20' })
  signupDate: string;

  @ApiProperty({
    description: 'Day0, Day1, Day2, ... 별 활동 데이터 (가입 전은 null)',
  })
  days: (CohortCellResponse | null)[];
}

export class DashboardResponse {
  @ApiProperty({ description: '오늘 기준 일별 통계', type: DailyStatsResponse })
  dailyStats: DailyStatsResponse;

  @ApiProperty({
    description: '일별 코호트 (행=가입일, 열=Day0~)',
    type: [CohortRowResponse],
  })
  cohort: CohortRowResponse[];

  @ApiProperty({ description: '코호트 최대 Day 수', example: 5 })
  maxDay: number;

  @ApiProperty({
    description: '멤버별 코호트 (행=멤버, 열=Day0~)',
    type: [MemberCohortRowResponse],
  })
  memberCohort: MemberCohortRowResponse[];

  @ApiProperty({ description: '멤버별 코호트 최대 Day 수', example: 5 })
  memberCohortMaxDay: number;
}
