import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import {
  apiSuccess,
  apiError,
  getMemberFromHeader,
  parseDate,
  formatDate,
} from '@shared/lib/api-helpers';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return apiError('date query param is required', 400);

  const member = await getMemberFromHeader(req.headers);
  const today = new Date().toISOString().split('T')[0];
  const isToday = date === today;
  const memberFilter = member ? { memberId: member.id } : {};

  let tasks;

  if (isToday) {
    const [pastUncompleted, todayCompleted] = await Promise.all([
      prisma.task.findMany({
        where: {
          targetDate: { lte: parseDate(today) },
          isCompleted: false,
          ...memberFilter,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.findMany({
        where: {
          targetDate: parseDate(today),
          isCompleted: true,
          ...memberFilter,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const seen = new Set<number>();
    tasks = [...pastUncompleted, ...todayCompleted].filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  } else {
    tasks = await prisma.task.findMany({
      where: { targetDate: parseDate(date), ...memberFilter },
      orderBy: { createdAt: 'desc' },
    });
  }

  const scheduledTaskIds = await prisma.schedule
    .findMany({
      where: { targetDate: parseDate(date), task: { isNot: null }, ...memberFilter },
      select: { taskId: true },
    })
    .then((rows) => new Set(rows.map((r) => r.taskId)));

  const taskItems = tasks
    .filter((t) => !scheduledTaskIds.has(t.id))
    .map((t) => ({
      taskId: t.id,
      name: t.name,
      isCompleted: t.isCompleted,
    }));

  return apiSuccess({ tasks: taskItems });
}

export async function POST(req: NextRequest) {
  const member = await getMemberFromHeader(req.headers);
  const body = await req.json();
  const { name, targetDate } = body;

  if (!name || !targetDate) return apiError('name and targetDate are required', 400);

  const task = await prisma.task.create({
    data: {
      name,
      targetDate: parseDate(targetDate),
      memberId: member?.id ?? null,
    },
  });

  return apiSuccess({ taskId: task.id }, 201);
}
