import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ scheduleId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { scheduleId } = await params;
  const member = await getMemberFromHeader(req.headers);

  const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } });
  if (!schedule) return apiError(`Schedule with id ${scheduleId} not found`, 404);
  if (member && schedule.memberId !== member.id) return apiError('권한이 없습니다.', 403);

  const today = new Date().toISOString().split('T')[0];
  await prisma.schedule.update({
    where: { id: Number(scheduleId) },
    data: { isCompleted: true, completedAt: new Date(`${today}T00:00:00Z`) },
  });

  return apiSuccess({ scheduleId: Number(scheduleId) });
}
