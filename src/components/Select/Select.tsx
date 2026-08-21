import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  disabled = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const listboxId = `${buttonId}-listbox`;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (options[highlightedIndex]) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-1.5 relative">
      {label && (
        <label
          htmlFor={buttonId}
          className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA]"
        >
          {label}
        </label>
      )}
      <button
        id={buttonId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={twMerge(
          clsx(
            'w-full h-10 px-3.5 py-2 text-xs bg-white dark:bg-[#0A1513] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 rounded-xl shadow-xs flex items-center justify-between transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-[#00F5A0]',
            disabled && 'bg-slate-100 dark:bg-[#041F18]/50 cursor-not-allowed opacity-60',
            error && 'border-[#EF4444] focus:ring-[#EF4444]',
            className
          )
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="font-medium text-slate-900 dark:text-white">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400 dark:text-[#71717A]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-slate-400 dark:text-[#71717A] transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 text-[#00F5A0]'
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-opt-${highlightedIndex}`}
          className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-60 overflow-auto bg-white dark:bg-[#0A1513] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl py-1 text-xs focus:outline-none backdrop-blur-xl"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                id={`${listboxId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={clsx(
                  'px-3.5 py-2.5 cursor-pointer flex items-center justify-between transition-colors',
                  isHighlighted && 'bg-[#00F5A0]/10 text-emerald-600 dark:text-[#00F5A0]',
                  isSelected && 'font-bold text-emerald-600 dark:text-[#00F5A0] bg-[#00F5A0]/15'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.icon}
                  <span>{option.label}</span>
                </span>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-[#00F5A0] shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
    </div>
  );
};
