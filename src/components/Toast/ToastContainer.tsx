import React from 'react';
import { useToastStore, ToastType } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-[#00F5A0] shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
  info: <Info className="w-5 h-5 text-emerald-500 dark:text-[#00F5A0] shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2.5 max-w-sm w-auto sm:w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0A1513] text-slate-900 dark:text-white border-l-4 border-l-emerald-500 dark:border-l-[#00F5A0] border-t border-r border-b border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_25px_rgba(0,245,160,0.25)] backdrop-blur-xl transition-all duration-300 animate-slideInRight'
          )}
        >
          {toastIcons[toast.type]}
          <div className="flex-1 pt-0.5 text-xs font-medium text-slate-900 dark:text-white leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 dark:text-[#71717A] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded-md"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
