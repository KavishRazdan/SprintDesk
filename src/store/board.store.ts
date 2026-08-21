import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority, TaskStatus, TaskFilterOptions, Comment } from '../types/task.types';
import { INITIAL_TASKS } from '../utils/mockData';

interface BoardState {
  tasks: Task[];
  historyStack: Task[][];
  filters: TaskFilterOptions;
  selectedTaskId: string | null;

  // Drag and Drop Actions
  moveTask: (taskId: string, targetStatus: TaskStatus, newIndex?: number) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  undoLastAction: () => boolean;

  // CRUD Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, text: string, author: string, avatar?: string) => void;
  selectTask: (id: string | null) => void;

  // Filters
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: TaskPriority | 'All') => void;
  setAssigneeFilter: (assigneeId: string | 'All') => void;
  resetFilters: () => void;
  resetToInitialTasks: () => void;
}

const initialFilters: TaskFilterOptions = {
  searchQuery: '',
  priority: 'All',
  assigneeId: 'All',
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      historyStack: [],
      filters: initialFilters,
      selectedTaskId: null,

      moveTask: (taskId, targetStatus, newIndex) =>
        set((state) => {
          const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;

          const task = state.tasks[taskIndex];
          if (task.status === targetStatus && newIndex === undefined) return state;

          // Save history snapshot before mutation
          const newHistory = [state.tasks, ...state.historyStack].slice(0, 10);

          const updatedTask = {
            ...task,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
          };

          const remainingTasks = state.tasks.filter((t) => t.id !== taskId);

          if (newIndex !== undefined && newIndex >= 0) {
            const targetStatusTasks = remainingTasks.filter((t) => t.status === targetStatus);
            targetStatusTasks.splice(newIndex, 0, updatedTask);
            const otherTasks = remainingTasks.filter((t) => t.status !== targetStatus);
            return { tasks: [...otherTasks, ...targetStatusTasks], historyStack: newHistory };
          }

          return { tasks: [...remainingTasks, updatedTask], historyStack: newHistory };
        }),

      reorderTasks: (activeId, overId) =>
        set((state) => {
          if (activeId === overId) return state;

          const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
          const newIndex = state.tasks.findIndex((t) => t.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const newHistory = [state.tasks, ...state.historyStack].slice(0, 10);

          const updatedTasks = [...state.tasks];
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          
          const overTask = state.tasks[newIndex];
          if (movedTask.status !== overTask.status) {
            movedTask.status = overTask.status;
            movedTask.updatedAt = new Date().toISOString();
          }

          updatedTasks.splice(newIndex, 0, movedTask);
          return { tasks: updatedTasks, historyStack: newHistory };
        }),

      undoLastAction: () => {
        const { historyStack } = get();
        if (historyStack.length === 0) return false;

        const previousTasks = historyStack[0];
        const remainingHistory = historyStack.slice(1);
        set({ tasks: previousTasks, historyStack: remainingHistory });
        return true;
      },

      addTask: (taskData) =>
        set((state) => {
          const newHistory = [state.tasks, ...state.historyStack].slice(0, 10);
          const newId = `TASK-${100 + state.tasks.length + 1}`;
          const now = new Date().toISOString();
          const newTask: Task = {
            ...taskData,
            id: newId,
            comments: [],
            createdAt: now,
            updatedAt: now,
          };
          return { tasks: [newTask, ...state.tasks], historyStack: newHistory };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => {
          const newHistory = [state.tasks, ...state.historyStack].slice(0, 10);
          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
            historyStack: newHistory,
          };
        }),

      addComment: (taskId, text, author, avatar) =>
        set((state) => {
          const newComment: Comment = {
            id: `c_${Date.now()}`,
            author,
            avatar: avatar || 'https://dummyjson.com/icon/emilys/128',
            text,
            createdAt: new Date().toISOString(),
          };
          return {
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? { ...task, comments: [...task.comments, newComment] }
                : task
            ),
          };
        }),

      selectTask: (id) => set({ selectedTaskId: id }),

      setSearchQuery: (query) =>
        set((state) => ({ filters: { ...state.filters, searchQuery: query } })),

      setPriorityFilter: (priority) =>
        set((state) => ({ filters: { ...state.filters, priority } })),

      setAssigneeFilter: (assigneeId) =>
        set((state) => ({ filters: { ...state.filters, assigneeId } })),

      resetFilters: () => set({ filters: initialFilters }),

      resetToInitialTasks: () => set({ tasks: INITIAL_TASKS, historyStack: [] }),
    }),
    {
      name: 'sprintdesk-board-state',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
