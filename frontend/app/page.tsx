import { TodoPage } from '@pages/todos';

export const dynamic = 'force-dynamic';

export default async function Page({searchParams}: {searchParams: Promise<{date?: string}>}) {
  const { date } = await searchParams;
  return <TodoPage date={date ?? new Date().toISOString().split('T')[0]} />;
}
