import { TodoPage } from '@pages/todos';

export const dynamic = 'force-dynamic';

export default async function Page({params}: {params: Promise<{date: string}>}) {
  const { date } = await params;
  return <TodoPage date={date} />;
}
