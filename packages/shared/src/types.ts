// Common types shared between frontend and backend

export interface Task {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  isScheduled: boolean;
}

export interface Schedule {
  id: string;
  taskId: string;
  date: string;
  order: number;
}

export interface Settings {
  scheduleStartTime: string;
  scheduleEndTime: string;
}
