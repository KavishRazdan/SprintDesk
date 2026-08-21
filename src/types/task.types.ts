export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TaskAssignee;
  dueDate: string; // YYYY-MM-DD
  storyPoints: number;
  tags: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export interface TaskFilterOptions {
  searchQuery: string;
  priority: TaskPriority | 'All';
  assigneeId: string | 'All';
}
