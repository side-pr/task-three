import { NextResponse } from 'next/server';
import { prisma } from '@shared/lib/prisma';

export function log(route: string, msg: string, data?: unknown) {
  console.log(`[${route}] ${msg}`, data !== undefined ? JSON.stringify(data) : '');
}

export function logError(route: string, msg: string, err: unknown) {
  console.error(`[${route}] ${msg}`, err instanceof Error ? err.message : String(err));
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ status, message: 'success', data }, { status });
}

export function apiError(route: string, message: string, status: number) {
  console.error(`[${route}] ${status} ${message}`);
  return NextResponse.json({ status, message, data: null }, { status });
}

export async function getMemberFromHeader(headers: Headers, route: string) {
  const visitorId = headers.get('x-visitor-id');
  if (!visitorId) {
    console.log(`[${route}] x-visitor-id header 없음`);
    return null;
  }

  try {
    const member = await prisma.member.upsert({
      where: { socialType_providerId: { socialType: 'VISITOR', providerId: visitorId } },
      create: { socialType: 'VISITOR', providerId: visitorId },
      update: {},
    });
    console.log(`[${route}] member resolved: id=${member.id} visitorId=${visitorId}`);
    return member;
  } catch (err) {
    console.error(`[${route}] member upsert 실패 visitorId=${visitorId}`, err instanceof Error ? err.message : String(err));
    throw err;
  }
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
