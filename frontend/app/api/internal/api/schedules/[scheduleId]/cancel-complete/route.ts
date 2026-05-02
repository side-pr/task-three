import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader, log, logError } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `PUT /api/schedules/${scheduleId}/cancel-complete`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } });
    if (!schedule) return apiError(ROUTE, '스케줄을 찾을 수 없습니다.', 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    await prisma.schedule.update({
      where: { id: Number(scheduleId) },
      data: { isCompleted: false, completedAt: null },
    });
    log(ROUTE, '완료 취소됨');
    return apiSuccess(null, 204);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
