import { useMemo } from 'react';
import { useBoardStore } from '../store/board.store';
import { Task, TaskStatus } from '../types/task.types';

export const useBoard = () => {
  const {
    tasks,
    filters,
    selectedTaskId,
    moveTask,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    selectTask,
    setSearchQuery,
    setPriorityFilter,
    setAssigneeFilter,
    resetFilters,
  } = useBoardStore();

  // Filter tasks with useMemo for high performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        !filters.searchQuery ||
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        task.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      // Priority filter
      const matchesPriority =
        filters.priority === 'All' || task.priority === filters.priority;

      // Assignee filter
      const matchesAssignee =
        filters.assigneeId === 'All' || task.assignee.id === filters.assigneeId;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, filters]);

  // Group tasks by column status
  const tasksByColumn = useMemo(() => {
    const columns: Record<TaskStatus, Task[]> = {
      Backlog: [],
      'In Progress': [],
      Review: [],
      Done: [],
    };

    filteredTasks.forEach((task) => {
      if (columns[task.status]) {
        columns[task.status].push(task);
      }
    });

    return columns;
  }, [filteredTasks]);

  // Get currently selected task object
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    tasksByColumn,
    filters,
    selectedTask,
    selectedTaskId,
    moveTask,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    selectTask,
    setSearchQuery,
    setPriorityFilter,
    setAssigneeFilter,
    resetFilters,
  };
};
