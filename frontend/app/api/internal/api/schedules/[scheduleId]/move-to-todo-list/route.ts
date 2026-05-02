import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader, log, logError } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `PUT /api/schedules/${scheduleId}/move-to-todo-list`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } });
    if (!schedule) return apiError(ROUTE, `Schedule with id ${scheduleId} not found`, 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    await prisma.schedule.delete({ where: { id: Number(scheduleId) } });
    log(ROUTE, '할일 목록으로 이동 완료');
    return apiSuccess(null, 204);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
