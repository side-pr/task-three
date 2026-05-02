import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader, log, logError } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ taskId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const ROUTE = `GET /api/tasks/${taskId}`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) return apiError(ROUTE, '할 일을 찾을 수 없습니다.', 404);
    if (member && task.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);
    return apiSuccess({ taskId: task.id, name: task.name });
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const ROUTE = `PUT /api/tasks/${taskId}`;
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const { name } = await req.json();
    log(ROUTE, '요청', { name });
    if (!name) return apiError(ROUTE, 'name is required', 400);

    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) return apiError(ROUTE, '할 일을 찾을 수 없습니다.', 404);
    if (member && task.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    await prisma.task.update({ where: { id: Number(taskId) }, data: { name } });
    log(ROUTE, '수정 완료');
    return apiSuccess({ taskId: Number(taskId) }, 201);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const ROUTE = `DELETE /api/tasks/${taskId}`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) return apiError(ROUTE, '할 일을 찾을 수 없습니다.', 404);
    if (member && task.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    await prisma.task.delete({ where: { id: Number(taskId) } });
    log(ROUTE, '삭제 완료');
    return apiSuccess(null, 204);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
