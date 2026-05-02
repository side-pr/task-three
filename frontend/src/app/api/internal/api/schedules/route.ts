import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import {
  apiSuccess,
  apiError,
  getMemberFromHeader,
  parseDate,
  parseTime,
  formatTime,
  formatDate,
} from '@shared/lib/api-helpers';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return apiError('date query param is required', 400);

  const member = await getMemberFromHeader(req.headers);
  const today = new Date().toISOString().split('T')[0];
  const isToday = date === today;
  const memberFilter = member ? { memberId: member.id } : {};

  let schedules;

  if (isToday) {
    const [pastUncompleted, todayCompleted] = await Promise.all([
      prisma.schedule.findMany({
        include: { task: true },
        where: {
          targetDate: { lte: parseDate(today) },
          isCompleted: false,
          ...memberFilter,
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.schedule.findMany({
        include: { task: true },
        where: {
          targetDate: parseDate(today),
          isCompleted: true,
          ...memberFilter,
        },
        orderBy: { startTime: 'asc' },
      }),
    ]);

    const seen = new Set<number>();
    schedules = [...pastUncompleted, ...todayCompleted].filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
    schedules.sort((a, b) =>
      formatTime(a.startTime).localeCompare(formatTime(b.startTime))
    );
  } else {
    schedules = await prisma.schedule.findMany({
      include: { task: true },
      where: { targetDate: parseDate(date), ...memberFilter },
      orderBy: { startTime: 'asc' },
    });
  }

  const scheduleItems = schedules.map((s) => ({
    scheduleId: s.id,
    taskId: s.task?.id ?? 0,
    name: s.task?.name ?? '',
    startTime: formatTime(s.startTime),
    endTime: formatTime(s.endTime),
    targetDate: formatDate(s.targetDate),
    isCompleted: s.isCompleted,
  }));

  return apiSuccess({ schedules: scheduleItems });
}

export async function POST(req: NextRequest) {
  const member = await getMemberFromHeader(req.headers);
  const body = await req.json();
  const { taskId, name, startTime, endTime, targetDate } = body;

  if (!taskId || !startTime || !endTime || !targetDate) {
    return apiError('taskId, startTime, endTime, targetDate are required', 400);
  }

  const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (!task) return apiError(`Task with id ${taskId} not found`, 404);

  if (name) {
    await prisma.task.update({ where: { id: Number(taskId) }, data: { name } });
  }

  const schedule = await prisma.schedule.create({
    data: {
      startTime: parseTime(startTime),
      endTime: parseTime(endTime),
      targetDate: parseDate(targetDate),
      taskId: Number(taskId),
      memberId: member?.id ?? null,
    },
  });

  return apiSuccess({ scheduleId: schedule.id }, 201);
}
