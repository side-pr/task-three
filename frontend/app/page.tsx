import { TodoPageClient } from './todo-page-client';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  return <TodoPageClient date={date ?? new Date().toISOString().split('T')[0]} />;
}
