import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import {
  apiSuccess,
  apiError,
  getMemberFromHeader,
  log,
  logError,
  parseDate,
  formatDate,
} from '@shared/lib/api-helpers';

const ROUTE = 'GET /api/tasks';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  log(ROUTE, `요청 date=${date}`);

  if (!date) return apiError(ROUTE, 'date query param is required', 400);

  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    const memberFilter = member ? { memberId: member.id } : {};

    let tasks;

    if (isToday) {
      const [pastUncompleted, todayCompleted] = await Promise.all([
        prisma.task.findMany({
          where: { targetDate: { lte: parseDate(today) }, isCompleted: false, ...memberFilter },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.task.findMany({
          where: { targetDate: parseDate(today), isCompleted: true, ...memberFilter },
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
      .map((t) => ({ taskId: t.id, name: t.name, isCompleted: t.isCompleted }));

    log(ROUTE, `응답 tasks=${taskItems.length}개`);
    return apiSuccess({ tasks: taskItems });
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const ROUTE = 'POST /api/tasks';
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const body = await req.json();
    const { name, targetDate } = body;
    log(ROUTE, `요청`, { name, targetDate });

    if (!name || !targetDate) return apiError(ROUTE, 'name and targetDate are required', 400);

    const task = await prisma.task.create({
      data: { name, targetDate: parseDate(targetDate), memberId: member?.id ?? null },
    });

    log(ROUTE, `생성 taskId=${task.id}`);
    return apiSuccess({ taskId: task.id }, 201);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
