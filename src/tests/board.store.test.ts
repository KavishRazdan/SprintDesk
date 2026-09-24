import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../store/board.store';
import { INITIAL_TASKS } from '../utils/mockData';

describe('Zustand Board Store', () => {
  beforeEach(() => {
    useBoardStore.setState({
      tasks: INITIAL_TASKS,
      filters: { searchQuery: '', priority: 'All', assigneeId: 'All' },
      selectedTaskId: null,
    });
  });

  it('should initialize with initial tasks', () => {
    const state = useBoardStore.getState();
    expect(state.tasks.length).toBeGreaterThanOrEqual(30);
  });

  it('should move task to a target column status', () => {
    const targetTaskId = INITIAL_TASKS[0].id;
    useBoardStore.getState().moveTask(targetTaskId, 'Done');

    const updatedTask = useBoardStore.getState().tasks.find((t) => t.id === targetTaskId);
    expect(updatedTask?.status).toBe('Done');
  });

  it('should add a new task item', () => {
    const initialLength = useBoardStore.getState().tasks.length;
    useBoardStore.getState().addTask({
      title: 'New Unit Test Task',
      status: 'Backlog',
      priority: 'High',
      dueDate: '2026-09-01',
      storyPoints: 3,
      tags: ['Testing'],
      assignee: { id: 'usr-1', name: 'Emily Johnson', avatar: '' },
    });

    const tasks = useBoardStore.getState().tasks;
    expect(tasks.length).toBe(initialLength + 1);
    expect(tasks[0].title).toBe('New Unit Test Task');
  });

  it('should update task details', () => {
    const targetTaskId = INITIAL_TASKS[0].id;
    useBoardStore.getState().updateTask(targetTaskId, { title: 'Updated Title' });

    const updatedTask = useBoardStore.getState().tasks.find((t) => t.id === targetTaskId);
    expect(updatedTask?.title).toBe('Updated Title');
  });

  it('should delete a task item', () => {
    const targetTaskId = INITIAL_TASKS[0].id;
    const initialLength = useBoardStore.getState().tasks.length;

    useBoardStore.getState().deleteTask(targetTaskId);

    const tasks = useBoardStore.getState().tasks;
    expect(tasks.length).toBe(initialLength - 1);
    expect(tasks.find((t) => t.id === targetTaskId)).toBeUndefined();
  });

  it('should update filter options', () => {
    useBoardStore.getState().setSearchQuery('OAuth');
    useBoardStore.getState().setPriorityFilter('Urgent');

    const filters = useBoardStore.getState().filters;
    expect(filters.searchQuery).toBe('OAuth');
    expect(filters.priority).toBe('Urgent');
  });

  it('should reorder tasks within the same column', () => {
    const backlogTasks = useBoardStore.getState().tasks.filter((t) => t.status === 'Backlog');
    expect(backlogTasks.length).toBeGreaterThanOrEqual(2);

    const firstTask = backlogTasks[0];
    const secondTask = backlogTasks[1];

    useBoardStore.getState().reorderTasks(firstTask.id, secondTask.id);

    const updatedBacklog = useBoardStore.getState().tasks.filter((t) => t.status === 'Backlog');
    expect(updatedBacklog[0].id).toBe(secondTask.id);
    expect(updatedBacklog[1].id).toBe(firstTask.id);
  });

  it('should move tasks between different columns and update status', () => {
    const backlogTasks = useBoardStore.getState().tasks.filter((t) => t.status === 'Backlog');
    const taskToMove = backlogTasks[0];

    useBoardStore.getState().moveTask(taskToMove.id, 'Review');

    const updatedTask = useBoardStore.getState().tasks.find((t) => t.id === taskToMove.id);
    expect(updatedTask?.status).toBe('Review');
  });

  it('should allow undoing a drag and drop move', () => {
    const targetTaskId = INITIAL_TASKS[0].id;
    const initialStatus = INITIAL_TASKS[0].status;

    useBoardStore.getState().moveTask(targetTaskId, 'Done', undefined, true);
    expect(useBoardStore.getState().tasks.find((t) => t.id === targetTaskId)?.status).toBe('Done');

    const undid = useBoardStore.getState().undoLastAction();
    expect(undid).toBe(true);
    expect(useBoardStore.getState().tasks.find((t) => t.id === targetTaskId)?.status).toBe(initialStatus);
  });

  it('should support transient moves without polluting the undo history stack', () => {
    const initialHistoryLength = useBoardStore.getState().historyStack.length;
    const targetTaskId = INITIAL_TASKS[0].id;

    useBoardStore.getState().moveTask(targetTaskId, 'In Progress', 0, false);

    expect(useBoardStore.getState().historyStack.length).toBe(initialHistoryLength);
  });
});
