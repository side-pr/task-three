import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VisitorState {
  visitorId: string | null;
  initVisitorId: () => void;
  getVisitorId: () => string;
}

const generateVisitorId = (): string => {
  return crypto.randomUUID();
};

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set, get) => ({
      visitorId: null,
      initVisitorId: () => {
        const currentId = get().visitorId;
        if (!currentId) {
          set({ visitorId: generateVisitorId() });
        }
      },
      getVisitorId: () => {
        const currentId = get().visitorId;
        if (!currentId) {
          const newId = generateVisitorId();
          set({ visitorId: newId });
          return newId;
        }
        return currentId;
      },
    }),
    {
      name: 'visitor-storage',
    }
  )
);
