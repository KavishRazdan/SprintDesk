export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type?: 'task' | 'system' | 'mention';
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isPolling: boolean;
}
