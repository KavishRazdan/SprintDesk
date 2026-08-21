import { TaskPriority, TaskStatus } from '../types/task.types';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case 'Urgent':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-full font-bold';
    case 'High':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full font-bold';
    case 'Medium':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full font-bold';
    case 'Low':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-bold';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full';
  }
};

export const getStatusBadgeClass = (status: TaskStatus): string => {
  switch (status) {
    case 'Backlog':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full font-bold';
    case 'In Progress':
      return 'bg-[#FEF3C7] text-[#D97706] dark:bg-amber-950/60 dark:text-amber-400 rounded-full font-bold';
    case 'Review':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 rounded-full font-bold';
    case 'Done':
      return 'bg-[#D1FAE5] text-[#059669] dark:bg-[#00F5A0]/20 dark:text-[#00F5A0] rounded-full font-bold';
  }
};
