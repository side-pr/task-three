import { TodoPage } from '@pages/todos';

export default async function Page({params}: {params: Promise<{date: string}>}) {
  const { date } = await params;
  return <TodoPage date={date} />;
}
