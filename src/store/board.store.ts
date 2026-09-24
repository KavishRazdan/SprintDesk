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
  moveTask: (taskId: string, targetStatus: TaskStatus, newIndex?: number, recordHistory?: boolean) => void;
  reorderTasks: (activeId: string, overId: string, recordHistory?: boolean) => void;
  setTasks: (tasks: Task[], recordHistory?: boolean) => void;
  recordHistorySnapshot: (snapshot?: Task[]) => void;
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

      moveTask: (taskId, targetStatus, newIndex, recordHistory = true) =>
        set((state) => {
          const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;

          const task = state.tasks[taskIndex];
          if (task.status === targetStatus && newIndex === undefined) return state;

          // Save history snapshot before mutation if recordHistory is true
          const newHistory = recordHistory
            ? [state.tasks, ...state.historyStack].slice(0, 10)
            : state.historyStack;

          const updatedTask: Task = {
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

      reorderTasks: (activeId, overId, recordHistory = true) =>
        set((state) => {
          if (activeId === overId) return state;

          const activeTask = state.tasks.find((t) => t.id === activeId);
          const overTask = state.tasks.find((t) => t.id === overId);

          if (!activeTask || !overTask) return state;

          const newHistory = recordHistory
            ? [state.tasks, ...state.historyStack].slice(0, 10)
            : state.historyStack;

          // Same column reordering: use precise column-relative positions
          if (activeTask.status === overTask.status) {
            const status = activeTask.status;
            const columnTasks = state.tasks.filter((t) => t.status === status);
            const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
            const newIndex = columnTasks.findIndex((t) => t.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
              const reorderedColumn = [...columnTasks];
              const [moved] = reorderedColumn.splice(oldIndex, 1);
              reorderedColumn.splice(newIndex, 0, moved);

              const otherTasks = state.tasks.filter((t) => t.status !== status);
              return { tasks: [...otherTasks, ...reorderedColumn], historyStack: newHistory };
            }
          }

          // Cross-column reordering: move to overTask column at overTask index
          const targetStatus = overTask.status;
          const updatedActiveTask: Task = {
            ...activeTask,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
          };

          const targetStatusTasks = state.tasks.filter(
            (t) => t.status === targetStatus && t.id !== activeId
          );
          const overIndex = targetStatusTasks.findIndex((t) => t.id === overId);

          if (overIndex !== -1) {
            targetStatusTasks.splice(overIndex, 0, updatedActiveTask);
          } else {
            targetStatusTasks.push(updatedActiveTask);
          }

          const otherTasks = state.tasks.filter(
            (t) => t.status !== targetStatus && t.id !== activeId
          );

          return { tasks: [...otherTasks, ...targetStatusTasks], historyStack: newHistory };
        }),

      setTasks: (tasks, recordHistory = false) =>
        set((state) => ({
          tasks,
          historyStack: recordHistory
            ? [state.tasks, ...state.historyStack].slice(0, 10)
            : state.historyStack,
        })),

      recordHistorySnapshot: (snapshot) =>
        set((state) => ({
          historyStack: [snapshot || state.tasks, ...state.historyStack].slice(0, 10),
        })),

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
