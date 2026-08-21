import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task.types';
import { formatDate, getPriorityBadgeClass } from '../../utils/formatters';
import { MessageSquare, Calendar, Flame, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick && onClick(task)}
      className={clsx(
        'group relative bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white border border-slate-200/50 dark:border-white/10 rounded-2xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-[#728974] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer select-none',
        isDragging && 'opacity-60 border-[#728974] ring-2 ring-[#728974]/40 shadow-xl scale-[1.03] z-50'
      )}
    >
      {/* Header: ID & Drag Handle & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-[#8A8A8A] hover:text-[#728974] cursor-grab active:cursor-grabbing transition-colors"
            title="Drag task"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-mono font-bold text-[#728974] dark:text-[#00F5A0]">
            {task.id}
          </span>
        </div>
        <span
          className={clsx(
            'text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
            getPriorityBadgeClass(task.priority)
          )}
        >
          {task.priority}
        </span>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-heading font-bold text-[#1C1C1C] dark:text-white group-hover:text-[#728974] transition-colors line-clamp-2 mb-3">
        {task.title}
      </h3>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EFECE6] dark:bg-[#041F18] text-[#5E7160] dark:text-[#A1A1AA] border border-slate-200/40 dark:border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/10 text-xs text-[#8A8A8A]">
        <div className="flex items-center gap-2">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            title={`Assigned to ${task.assignee.name}`}
            className="w-6 h-6 rounded-full border border-slate-200 object-cover shadow-xs"
          />
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5E7160] dark:text-[#00F5A0] bg-[#E8EFE9] dark:bg-[#00F5A0]/10 px-2 py-0.5 rounded-full border border-emerald-200/40">
            <Flame className="w-3 h-3 text-[#728974]" />
            <span>{task.storyPoints} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#8A8A8A]">
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] hover:text-[#1C1C1C] dark:hover:text-white">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{task.comments.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px]" title={`Due date: ${task.dueDate}`}>
            <Calendar className="w-3.5 h-3.5 text-[#728974]" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
