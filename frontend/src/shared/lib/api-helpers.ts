import { NextResponse } from 'next/server';
import { prisma } from '@shared/lib/prisma';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ status, message: 'success', data }, { status });
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ status, message, data: null }, { status });
}

export async function getMemberFromHeader(headers: Headers) {
  const visitorId = headers.get('x-visitor-id');
  if (!visitorId) return null;

  return prisma.member.upsert({
    where: { socialType_providerId: { socialType: 'VISITOR', providerId: visitorId } },
    create: { socialType: 'VISITOR', providerId: visitorId },
    update: {},
  });
}

export function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseTime(timeStr: string): Date {
  const [h, m, s] = timeStr.split(':').map(Number);
  const d = new Date(0);
  d.setUTCHours(h, m, s ?? 0, 0);
  return d;
}

export function formatTime(date: Date): string {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  const s = date.getUTCSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}
