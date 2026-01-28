import { Routes, Route, Navigate } from 'react-router-dom';
import { TodoPageWrapper } from '@pages/todos/ui/todo-page-wrapper';

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Routes>
        <Route path="/" element={<TodoPageWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
