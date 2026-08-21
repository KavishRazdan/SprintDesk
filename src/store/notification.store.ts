import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNotification } from '../types/notification.types';
import { MOCK_INITIAL_NOTIFICATIONS } from '../utils/mockData';

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  isPollingPaused: boolean;

  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  setPollingPaused: (paused: boolean) => void;
}

const initialNotifications: AppNotification[] = MOCK_INITIAL_NOTIFICATIONS.map((n) => ({
  id: `n_${n.id}`,
  title: n.title,
  body: n.message,
  read: n.read,
  type: (n.type as 'system' | 'task' | 'alert') || 'system',
  createdAt: n.createdAt,
}));

const initialUnread = initialNotifications.filter((n) => !n.read).length;

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: initialNotifications,
      unreadCount: initialUnread,
      isPollingPaused: false,

      addNotification: (item) =>
        set((state) => {
          const newNotif: AppNotification = {
            ...item,
            id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            read: false,
            createdAt: new Date().toISOString(),
          };

          const updated = [newNotif, ...state.notifications].slice(0, 20); // Keep latest 20
          const unread = updated.filter((n) => !n.read).length;

          return { notifications: updated, unreadCount: unread };
        }),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadCount: unread };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      setPollingPaused: (paused) => set({ isPollingPaused: paused }),
    }),
    {
      name: 'sprintdesk-notifications',
    }
  )
);
