'use client';

import dynamic from 'next/dynamic';

const TodoPage = dynamic(() => import('@pages/todos').then((m) => m.TodoPage), { ssr: false });

export function TodoPageClient({ date }: { date: string }) {
  return <TodoPage date={date} />;
}
