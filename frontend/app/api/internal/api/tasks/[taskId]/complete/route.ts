import { NextRequest } from 'next/server';
import { prisma } from '@shared/lib/prisma';
import { apiSuccess, apiError, getMemberFromHeader } from '@shared/lib/api-helpers';

type Params = { params: Promise<{ taskId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const member = await getMemberFromHeader(req.headers);

  const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (!task) return apiError('할 일을 찾을 수 없습니다.', 404);
  if (member && task.memberId !== member.id) return apiError('권한이 없습니다.', 403);

  const today = new Date().toISOString().split('T')[0];
  await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      isCompleted: true,
      completedAt: new Date(`${today}T00:00:00Z`),
    },
  });

  return apiSuccess({ taskId: Number(taskId) });
}
