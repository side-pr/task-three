import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader, log, logError } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ taskId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const ROUTE = `PUT /api/tasks/${taskId}/cancel-complete`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) return apiError(ROUTE, '할 일을 찾을 수 없습니다.', 404);
    if (member && task.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    await prisma.task.update({
      where: { id: Number(taskId) },
      data: { isCompleted: false, completedAt: null },
    });
    log(ROUTE, '완료 취소됨');
    return apiSuccess({ taskId: Number(taskId) });
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
