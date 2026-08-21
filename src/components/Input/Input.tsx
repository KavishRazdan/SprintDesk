import React, { useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-[#71717A] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={twMerge(
              clsx(
                'w-full h-10 px-3.5 py-2 text-xs bg-white dark:bg-[#0A1513] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 rounded-xl shadow-xs placeholder:text-slate-400 dark:placeholder:text-[#71717A] transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-[#00F5A0]',
                'disabled:bg-slate-100 dark:disabled:bg-[#041F18]/50 disabled:cursor-not-allowed disabled:opacity-60',
                leftIcon && 'pl-9',
                rightIcon && 'pr-9',
                error &&
                  'border-[#EF4444] focus:ring-[#EF4444] focus:border-[#EF4444]',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-[#71717A] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-xs font-medium text-[#EF4444]">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-[#71717A]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
