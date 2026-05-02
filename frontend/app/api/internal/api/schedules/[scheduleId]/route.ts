import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import {
  apiSuccess,
  apiError,
  getMemberFromHeader,
  log,
  logError,
  parseTime,
  formatTime,
} from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `GET /api/schedules/${scheduleId}`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
      include: { task: true },
    });
    if (!schedule) return apiError(ROUTE, `Schedule with id ${scheduleId} not found`, 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);
    if (!schedule.task) return apiError(ROUTE, '연결된 Task를 찾을 수 없습니다.', 404);

    return apiSuccess({
      scheduleId: schedule.id,
      taskId: schedule.task.id,
      name: schedule.task.name,
      startTime: formatTime(schedule.startTime),
      endTime: formatTime(schedule.endTime),
    });
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `PUT /api/schedules/${scheduleId}`;
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const body = await req.json();
    const { taskId, name, startTime, endTime } = body;
    log(ROUTE, '요청', { taskId, name, startTime, endTime });

    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
      include: { task: true },
    });
    if (!schedule) return apiError(ROUTE, `Schedule with id ${scheduleId} not found`, 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) return apiError(ROUTE, `Task with id ${taskId} not found`, 404);

    if (name) await prisma.task.update({ where: { id: Number(taskId) }, data: { name } });

    await prisma.schedule.update({
      where: { id: Number(scheduleId) },
      data: {
        ...(startTime && { startTime: parseTime(startTime) }),
        ...(endTime && { endTime: parseTime(endTime) }),
        taskId: Number(taskId),
      },
    });

    log(ROUTE, '수정 완료');
    return apiSuccess({ scheduleId: Number(scheduleId) }, 201);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const ROUTE = `DELETE /api/schedules/${scheduleId}`;
  log(ROUTE, '요청');
  try {
    const member = await getMemberFromHeader(req.headers, ROUTE);
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
      include: { task: true },
    });
    if (!schedule) return apiError(ROUTE, '스케줄을 찾을 수 없습니다.', 404);
    if (member && schedule.memberId !== member.id) return apiError(ROUTE, '권한이 없습니다.', 403);

    if (schedule.task) {
      await prisma.task.delete({ where: { id: schedule.task.id } });
    }
    log(ROUTE, '삭제 완료');
    return apiSuccess(null, 204);
  } catch (err) {
    logError(ROUTE, 'DB 오류', err);
    return apiError(ROUTE, 'Internal server error', 500);
  }
}
