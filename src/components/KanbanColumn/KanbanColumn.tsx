import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types/task.types';
import { TaskCard } from '../TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { clsx } from 'clsx';

export interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTaskClick: (status: TaskStatus) => void;
}

const statusColorDots: Record<TaskStatus, string> = {
  Backlog: 'bg-[#8A8A8A]',
  'In Progress': 'bg-[#F59E0B] animate-pulse',
  Review: 'bg-purple-500',
  Done: 'bg-[#728974]',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(
  ({ status, tasks, onTaskClick, onAddTaskClick }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: status,
      data: {
        type: 'Column',
        status,
      },
    });

    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
    const totalStoryPoints = useMemo(() => tasks.reduce((sum, t) => sum + t.storyPoints, 0), [tasks]);

    return (
      <div
        ref={setNodeRef}
        className={clsx(
          'flex flex-col w-80 shrink-0 bg-[#EFECE6]/80 dark:bg-[#041F18]/40 border border-slate-200/60 dark:border-white/10 rounded-3xl p-4 transition-all duration-200 min-h-[520px] backdrop-blur-md',
          isOver && 'ring-2 ring-[#728974] border-[#728974] bg-[#E8EFE9]/60 dark:bg-[#00F5A0]/5 shadow-lg'
        )}
      >
        {/* Sticky Column Header */}
        <div className="flex items-center justify-between px-4 py-3 mb-3.5 bg-white dark:bg-[#041F18] border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xs sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className={clsx('w-2.5 h-2.5 rounded-full', statusColorDots[status])} />
            <h2 className="text-sm font-heading font-bold text-[#1C1C1C] dark:text-white tracking-tight">
              {status}
            </h2>
            <span className="text-xs font-heading font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8EFE9] text-[#5E7160] border border-emerald-200/40">
              {tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-[#8A8A8A]">
              {totalStoryPoints} pts
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTaskClick(status)}
              aria-label={`Add task to ${status}`}
              className="w-7 h-7 p-0 rounded-full text-[#8A8A8A] hover:text-[#728974]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sortable Tasks Container */}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px] pr-1">
            {tasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300/70 dark:border-white/10 rounded-2xl p-6 text-center">
                <p className="text-xs text-[#8A8A8A] font-medium">
                  Drop tasks here or click + to add
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';
