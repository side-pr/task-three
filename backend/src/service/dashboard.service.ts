import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/entities/task.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { Member } from 'src/entities/member.entity';
import {
  DailyStatsResponse,
  CohortCellResponse,
  CohortRowResponse,
  MemberCohortRowResponse,
  DashboardResponse,
} from 'src/dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getDashboard(): Promise<DashboardResponse> {
    const today = new Date().toISOString().split('T')[0];

    const [dailyStats, members, tasks, schedules] = await Promise.all([
      this.getDailyStats(today),
      this.memberRepository.find(),
      this.taskRepository.find({ relations: ['member'] }),
      this.scheduleRepository.find({ relations: ['member'] }),
    ]);

    const cohort = this.getCohort(members, tasks, schedules, today);
    const memberCohort = this.getMemberCohort(members, tasks, schedules, today);

    const maxDay = cohort.reduce(
      (max, row) => Math.max(max, row.days.length - 1),
      0,
    );
    const memberCohortMaxDay = memberCohort.reduce(
      (max, row) => Math.max(max, row.days.length - 1),
      0,
    );

    const response = new DashboardResponse();
    response.dailyStats = dailyStats;
    response.cohort = cohort;
    response.maxDay = maxDay;
    response.memberCohort = memberCohort;
    response.memberCohortMaxDay = memberCohortMaxDay;

    return response;
  }

  private async getDailyStats(date: string): Promise<DailyStatsResponse> {
    const [taskTotal, taskCompleted, scheduleTotal, scheduleCompleted] =
      await Promise.all([
        this.taskRepository.count({ where: { targetDate: date } }),
        this.taskRepository.count({
          where: { targetDate: date, isCompleted: true },
        }),
        this.scheduleRepository.count({ where: { targetDate: date } }),
        this.scheduleRepository.count({
          where: { targetDate: date, isCompleted: true },
        }),
      ]);

    return new DailyStatsResponse(
      taskTotal,
      taskCompleted,
      scheduleTotal,
      scheduleCompleted,
    );
  }

  private getCohort(
    members: Member[],
    tasks: Task[],
    schedules: Schedule[],
    today: string,
  ): CohortRowResponse[] {
    // 멤버를 가입일(date only)별로 그룹핑
    const cohortMap = new Map<
      string,
      { memberIds: Set<number>; memberCount: number }
    >();

    for (const member of members) {
      const signupDate = new Date(member.createdAt).toISOString().split('T')[0];
      if (!cohortMap.has(signupDate)) {
        cohortMap.set(signupDate, { memberIds: new Set(), memberCount: 0 });
      }
      const group = cohortMap.get(signupDate)!;
      group.memberIds.add(member.id);
      group.memberCount++;
    }

    // 코호트별 Day 오프셋 기준 셀 데이터 구축
    // key: "signupDate:dayOffset" -> CohortCellResponse
    const cellMap = new Map<string, CohortCellResponse>();

    const getCell = (key: string): CohortCellResponse => {
      if (!cellMap.has(key)) {
        const cell = new CohortCellResponse();
        cell.taskRegistered = 0;
        cell.taskCompleted = 0;
        cell.scheduleRegistered = 0;
        cell.scheduleCompleted = 0;
        cellMap.set(key, cell);
      }
      return cellMap.get(key)!;
    };

    // Task 집계
    for (const task of tasks) {
      if (!task.member || !task.targetDate) continue;
      const memberId = task.member.id;

      for (const [signupDate, group] of cohortMap) {
        if (!group.memberIds.has(memberId)) continue;
        const dayOffset = this.diffDays(signupDate, task.targetDate);
        if (dayOffset < 0) continue;

        const cell = getCell(`${signupDate}:${dayOffset}`);
        cell.taskRegistered++;
        if (task.isCompleted) cell.taskCompleted++;
        break;
      }
    }

    // Schedule 집계
    for (const schedule of schedules) {
      if (!schedule.member) continue;
      const memberId = schedule.member.id;

      for (const [signupDate, group] of cohortMap) {
        if (!group.memberIds.has(memberId)) continue;
        const dayOffset = this.diffDays(signupDate, schedule.targetDate);
        if (dayOffset < 0) continue;

        const cell = getCell(`${signupDate}:${dayOffset}`);
        cell.scheduleRegistered++;
        if (schedule.isCompleted) cell.scheduleCompleted++;
        break;
      }
    }

    // 행(Row) 조립 — 가입일 오름차순
    const sortedDates = [...cohortMap.keys()].sort();
    const rows: CohortRowResponse[] = [];

    for (const signupDate of sortedDates) {
      const group = cohortMap.get(signupDate)!;
      const maxDayOffset = this.diffDays(signupDate, today);

      const row = new CohortRowResponse();
      row.date = signupDate;
      row.memberCount = group.memberCount;
      row.days = [];

      for (let d = 0; d <= maxDayOffset; d++) {
        const key = `${signupDate}:${d}`;
        row.days.push(
          cellMap.get(key) ?? {
            taskRegistered: 0,
            taskCompleted: 0,
            scheduleRegistered: 0,
            scheduleCompleted: 0,
          },
        );
      }

      rows.push(row);
    }

    return rows;
  }

  private getMemberCohort(
    members: Member[],
    tasks: Task[],
    schedules: Schedule[],
    today: string,
  ): MemberCohortRowResponse[] {
    const sorted = [...members].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    // member.id별 tasks/schedules Map 구축
    const tasksByMember = new Map<number, Task[]>();
    for (const task of tasks) {
      if (!task.member) continue;
      const id = task.member.id;
      if (!tasksByMember.has(id)) tasksByMember.set(id, []);
      tasksByMember.get(id)!.push(task);
    }

    const schedulesByMember = new Map<number, Schedule[]>();
    for (const schedule of schedules) {
      if (!schedule.member) continue;
      const id = schedule.member.id;
      if (!schedulesByMember.has(id)) schedulesByMember.set(id, []);
      schedulesByMember.get(id)!.push(schedule);
    }

    return sorted.map((member, index) => {
      const signupDate = new Date(member.createdAt).toISOString().split('T')[0];
      const maxDayOffset = this.diffDays(signupDate, today);

      const cells: CohortCellResponse[] = [];
      for (let d = 0; d <= maxDayOffset; d++) {
        const cell = new CohortCellResponse();
        cell.taskRegistered = 0;
        cell.taskCompleted = 0;
        cell.scheduleRegistered = 0;
        cell.scheduleCompleted = 0;
        cells.push(cell);
      }

      const memberTasks = tasksByMember.get(member.id) ?? [];
      for (const task of memberTasks) {
        if (!task.targetDate) continue;
        const dayOffset = this.diffDays(signupDate, task.targetDate);
        if (dayOffset < 0 || dayOffset > maxDayOffset) continue;
        cells[dayOffset].taskRegistered++;
        if (task.isCompleted) cells[dayOffset].taskCompleted++;
      }

      const memberSchedules = schedulesByMember.get(member.id) ?? [];
      for (const schedule of memberSchedules) {
        const dayOffset = this.diffDays(signupDate, schedule.targetDate);
        if (dayOffset < 0 || dayOffset > maxDayOffset) continue;
        cells[dayOffset].scheduleRegistered++;
        if (schedule.isCompleted) cells[dayOffset].scheduleCompleted++;
      }

      const row = new MemberCohortRowResponse();
      row.label = `M${index + 1}`;
      row.signupDate = signupDate;
      row.days = cells;
      return row;
    });
  }

  private diffDays(from: string, to: string): number {
    const a = new Date(from + 'T00:00:00');
    const b = new Date(to + 'T00:00:00');
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  }
}
