import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notification.store';
import { formatDate } from '../../utils/formatters';
import { Button } from '../Button';
import { clsx } from 'clsx';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popoverContent = isOpen ? (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-slate-900/30 dark:bg-black/60 backdrop-blur-xs sm:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Responsive Notification Popover */}
      <div
        ref={containerRef}
        className={clsx(
          'fixed inset-x-3 top-16 z-[9999] max-w-sm mx-auto sm:max-w-none sm:w-96 sm:absolute sm:inset-auto sm:top-14 sm:right-16 md:right-20 lg:right-28 bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn font-sans'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-white/10 bg-[#F4F2EE] dark:bg-[#041F18]/60">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-heading font-bold text-[#1C1C1C] dark:text-white tracking-tight">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-heading font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8EFE9] text-[#5E7160] dark:bg-[#00F5A0]/20 dark:text-[#00F5A0] border border-emerald-200/40">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-[#728974] dark:text-[#00F5A0] hover:underline font-semibold px-2 py-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                title="Clear notifications"
                className="text-[#8A8A8A] hover:text-[#EF4444] transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-[#8A8A8A] hover:text-[#1C1C1C] p-1 ml-1"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {notifications.length === 0 ? (
            <div className="py-8 px-4 text-center text-[#8A8A8A] text-xs font-medium">
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
                    ? 'bg-[#E8EFE9]/50 dark:bg-[#00F5A0]/5 hover:bg-[#E8EFE9] dark:hover:bg-[#00F5A0]/10'
                    : 'hover:bg-slate-50 dark:hover:bg-[#041F18]/30 opacity-75'
                )}
              >
                <span
                  className={clsx(
                    'mt-1.5 w-2 h-2 rounded-full shrink-0',
                    !n.read ? 'bg-[#728974] dark:bg-[#00F5A0] shadow-xs' : 'bg-transparent'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-xs font-heading font-bold text-[#1C1C1C] dark:text-white truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-[#8A8A8A] shrink-0">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {n.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        className="relative w-9 h-9 p-0 rounded-full text-[#8A8A8A] hover:text-[#728974] hover:bg-slate-100 dark:hover:bg-[#00F5A0]/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#728974] dark:bg-[#00F5A0] text-[10px] font-extrabold text-white dark:text-[#020B09] shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {typeof document !== 'undefined' && popoverContent
        ? createPortal(popoverContent, document.body)
        : null}
    </div>
  );
};
