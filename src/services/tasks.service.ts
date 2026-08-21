import { Task } from '../types/task.types';
import { INITIAL_TASKS } from '../utils/mockData';

export const tasksService = {
  fetchInitialTasks: async (): Promise<Task[]> => {
    // Simulate async data fetching delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    return INITIAL_TASKS;
  },
};
