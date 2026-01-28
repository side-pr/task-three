import { useSearchParams } from 'react-router-dom';
import { TodoPage } from '../todo-page';

const getToday = () => new Date().toISOString().split('T')[0];

export const TodoPageWrapper = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') ?? getToday();

  return <TodoPage date={date} />;
};
