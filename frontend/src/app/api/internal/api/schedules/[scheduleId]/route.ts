import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import {
  apiSuccess,
  apiError,
  getMemberFromHeader,
  parseTime,
  formatTime,
} from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const member = await getMemberFromHeader(req.headers);

  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(scheduleId) },
    include: { task: true },
  });
  if (!schedule) return apiError(`Schedule with id ${scheduleId} not found`, 404);
  if (member && schedule.memberId !== member.id) return apiError('권한이 없습니다.', 403);
  if (!schedule.task) return apiError('연결된 Task를 찾을 수 없습니다.', 404);

  return apiSuccess({
    scheduleId: schedule.id,
    taskId: schedule.task.id,
    name: schedule.task.name,
    startTime: formatTime(schedule.startTime),
    endTime: formatTime(schedule.endTime),
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const member = await getMemberFromHeader(req.headers);
  const body = await req.json();
  const { taskId, name, startTime, endTime } = body;

  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(scheduleId) },
    include: { task: true },
  });
  if (!schedule) return apiError(`Schedule with id ${scheduleId} not found`, 404);
  if (member && schedule.memberId !== member.id) return apiError('권한이 없습니다.', 403);

  const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (!task) return apiError(`Task with id ${taskId} not found`, 404);

  if (name) await prisma.task.update({ where: { id: Number(taskId) }, data: { name } });

  await prisma.schedule.update({
    where: { id: Number(scheduleId) },
    data: {
      ...(startTime && { startTime: parseTime(startTime) }),
      ...(endTime && { endTime: parseTime(endTime) }),
      taskId: Number(taskId),
    },
  });

  return apiSuccess({ scheduleId: Number(scheduleId) }, 201);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const member = await getMemberFromHeader(req.headers);

  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(scheduleId) },
    include: { task: true },
  });
  if (!schedule) return apiError('스케줄을 찾을 수 없습니다.', 404);
  if (member && schedule.memberId !== member.id) return apiError('권한이 없습니다.', 403);

  if (schedule.task) {
    await prisma.task.delete({ where: { id: schedule.task.id } });
  }

  return apiSuccess(null, 204);
}
