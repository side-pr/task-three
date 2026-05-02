import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader, log, logError } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `PUT /api/schedules/${scheduleId}/complete`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } });
    if (!schedule) return apiError(ROUTE, `Schedule with id ${scheduleId} not found`, 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    const today = new Date().toISOString().split('T')[0];
    await prisma.schedule.update({
      where: { id: Number(scheduleId) },
      data: { isCompleted: true, completedAt: new Date(`${today}T00:00:00Z`) },
    });
    log(ROUTE, '완료 처리됨');
    return apiSuccess({ scheduleId: Number(scheduleId) });
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
