import { Task, TaskPriority, TaskStatus } from '../types/task.types';
import mockDataJson from './mock-data.json';

// Helper to map JSON status strings to TaskStatus
const mapStatus = (status: string): TaskStatus => {
  switch (status.toLowerCase()) {
    case 'done':
      return 'Done';
    case 'in-progress':
    case 'inprogress':
      return 'In Progress';
    case 'review':
      return 'Review';
    case 'backlog':
    default:
      return 'Backlog';
  }
};

// Helper to map JSON priority strings to TaskPriority
const mapPriority = (priority: string): TaskPriority => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'low':
      return 'Low';
    case 'medium':
    default:
      return 'Medium';
  }
};

// Transform raw mock-data.json tasks into strongly-typed Task array
export const INITIAL_TASKS: Task[] = mockDataJson.tasks.map((rawTask) => {
  const assigneeUser = mockDataJson.users.find((u) => u.id === rawTask.assigneeId) || {
    id: 1,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
  };

  const taskComments = mockDataJson.comments
    .filter((c) => c.taskId === rawTask.id)
    .map((c) => {
      const author = mockDataJson.users.find((u) => u.id === c.authorId);
      return {
        id: `c_${c.id}`,
        author: author ? author.name : 'Team Member',
        avatar: author ? author.avatar : 'https://i.pravatar.cc/150?img=47',
        text: c.message,
        createdAt: c.createdAt,
      };
    });

  return {
    id: `TASK-${rawTask.id}`,
    title: rawTask.title,
    description: rawTask.description,
    status: mapStatus(rawTask.status),
    priority: mapPriority(rawTask.priority),
    assignee: {
      id: `usr_${assigneeUser.id}`,
      name: assigneeUser.name,
      avatar: assigneeUser.avatar,
    },
    dueDate: rawTask.dueDate,
    storyPoints: rawTask.priority === 'high' ? 5 : rawTask.priority === 'medium' ? 3 : 2,
    tags: [`Sprint ${rawTask.sprintId}`, rawTask.priority],
    comments: taskComments,
    createdAt: rawTask.createdAt,
    updatedAt: rawTask.updatedAt,
  };
});

export const MOCK_USERS = mockDataJson.users;
export const MOCK_SPRINTS = mockDataJson.sprints;
export const MOCK_INITIAL_NOTIFICATIONS = mockDataJson.notifications;
