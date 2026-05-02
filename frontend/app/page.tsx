import dynamic from 'next/dynamic';

const TodoPage = dynamic(() => import('@pages/todos').then((m) => m.TodoPage), { ssr: false });

export const dynamicMode = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  return <TodoPage date={date ?? new Date().toISOString().split('T')[0]} />;
}
