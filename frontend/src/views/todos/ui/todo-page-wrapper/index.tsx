'use client';

import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { OverlayProvider } from 'overlay-kit';
import { getQueryClient } from '@app/providers/get-query-client';
import { TodoPage } from '../todo-page';

export function TodoPageWrapper() {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <div className="w-full h-full flex flex-col items-center font-pretendard">
          <Suspense fallback={<div>Loading...</div>}>
            <TodoPage />
          </Suspense>
        </div>
      </OverlayProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
