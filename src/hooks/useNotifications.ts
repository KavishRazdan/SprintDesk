import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notification.store';
import { notificationsService } from '../services/notifications.service';
import { useToast } from './useToast';

export const useNotifications = (pollingIntervalMs = 15000) => {
  const { addNotification, isPollingPaused, setPollingPaused } = useNotificationStore();
  const toast = useToast();
  const knownIdsRef = useRef<Set<number>>(new Set());

  // Listen to Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      setPollingPaused(isHidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setPollingPaused]);

  // Polling logic
  useEffect(() => {
    if (isPollingPaused) return;

    let isMounted = true;

    const poll = async () => {
      try {
        const posts = await notificationsService.fetchLatestPosts();
        if (!isMounted) return;

        posts.forEach((post) => {
          if (!knownIdsRef.current.has(post.id)) {
            knownIdsRef.current.add(post.id);

            // Only trigger toast for items after initial seed load
            if (knownIdsRef.current.size > 5) {
              const notifTitle = `New Update: ${post.title.substring(0, 30)}...`;
              addNotification({
                title: notifTitle,
                body: post.body,
                type: 'system',
              });
              toast.info(notifTitle);
            }
          }
        });
      } catch (err) {
        // Silent catch for network hiccups during polling
        console.warn('Polling notification warning:', err);
      }
    };

    poll();
    const timer = setInterval(poll, pollingIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [isPollingPaused, pollingIntervalMs, addNotification, toast]);
};
