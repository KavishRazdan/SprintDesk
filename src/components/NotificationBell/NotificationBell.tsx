import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notification.store';
import { formatDate } from '../../utils/formatters';
import { Button } from '../Button';
import { clsx } from 'clsx';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        className="relative w-9 h-9 p-0 rounded-xl text-slate-600 dark:text-[#A1A1AA] hover:text-emerald-600 dark:hover:text-[#00F5A0] hover:bg-slate-100 dark:hover:bg-[#00F5A0]/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00F5A0] text-[10px] font-extrabold text-[#020B09] shadow-sm dark:shadow-[0_0_10px_rgba(0,245,160,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#0A1513] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_0_35px_rgba(4,31,24,0.9)] z-50 overflow-hidden backdrop-blur-xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#041F18]/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#00F5A0]/20 text-emerald-700 dark:text-[#00F5A0] border border-emerald-200 dark:border-[#00F5A0]/30">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-[#00F5A0] hover:underline font-semibold px-2 py-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  title="Clear notifications"
                  className="text-slate-400 dark:text-[#71717A] hover:text-[#EF4444] transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center text-slate-400 dark:text-[#71717A] text-xs font-medium">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={clsx(
                    'p-3.5 transition-colors cursor-pointer flex items-start gap-3',
                    !n.read
                      ? 'bg-emerald-50/60 dark:bg-[#00F5A0]/5 hover:bg-emerald-50 dark:hover:bg-[#00F5A0]/10'
                      : 'hover:bg-slate-50 dark:hover:bg-[#041F18]/30 opacity-75'
                  )}
                >
                  <span
                    className={clsx(
                      'mt-1.5 w-2 h-2 rounded-full shrink-0',
                      !n.read ? 'bg-emerald-500 dark:bg-[#00F5A0] shadow-xs dark:shadow-[0_0_8px_rgba(0,245,160,0.8)]' : 'bg-transparent'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-heading font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-[#71717A] shrink-0">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
