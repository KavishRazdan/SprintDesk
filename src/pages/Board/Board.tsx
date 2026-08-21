import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoard } from '../../hooks/useBoard';
import { KanbanColumn } from '../../components/KanbanColumn';
import { TaskCard } from '../../components/TaskCard';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { useToast } from '../../hooks/useToast';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Send,
  Calendar,
  User,
  Flame,
  X,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import { useBoardStore } from '../../store/board.store';
import { formatDate } from '../../utils/formatters';

const COLUMNS: TaskStatus[] = ['Backlog', 'In Progress', 'Review', 'Done'];

export const Board: React.FC = () => {
  const {
    tasksByColumn,
    allTasks,
    filters,
    selectedTask,
    selectedTaskId,
    moveTask,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    selectTask,
    setSearchQuery,
    setPriorityFilter,
    resetFilters,
  } = useBoard();

  const resetToInitialTasks = useBoardStore((state) => state.resetToInitialTasks);
  const undoLastAction = useBoardStore((state) => state.undoLastAction);
  const historyStack = useBoardStore((state) => state.historyStack);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const toast = useToast();

  // Create Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('Backlog');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskStoryPoints, setNewTaskStoryPoints] = useState(3);
  const [newTaskAssigneeName, setNewTaskAssigneeName] = useState('Emily Johnson');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = allTasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    if (COLUMNS.includes(overId as TaskStatus)) {
      const activeTaskItem = allTasks.find((t) => t.id === activeId);
      if (activeTaskItem && activeTaskItem.status !== overId) {
        moveTask(activeId, overId as TaskStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (COLUMNS.includes(overId as TaskStatus)) {
      moveTask(activeId, overId as TaskStatus);
    } else {
      reorderTasks(activeId, overId);
    }
  };

  const handleUndo = () => {
    const success = undoLastAction();
    if (success) {
      toast.success('Undid last board action');
    } else {
      toast.info('No actions to undo');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    addTask({
      title: newTaskTitle,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      storyPoints: Number(newTaskStoryPoints) || 1,
      tags: ['Sprint 24'],
      assignee: {
        id: `usr_${Date.now()}`,
        name: newTaskAssigneeName,
        avatar: 'https://dummyjson.com/icon/emilys/128',
      },
    });

    toast.success('New sprint task created');
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
  };

  const handleDeleteTask = () => {
    if (!selectedTaskId) return;
    deleteTask(selectedTaskId);
    toast.success('Task deleted');
    setIsDeleteModalOpen(false);
    selectTask(null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !newCommentText.trim()) return;

    addComment(selectedTaskId, newCommentText, 'Emily Johnson', 'https://dummyjson.com/icon/emilys/128');
    setNewCommentText('');
    toast.success('Comment added');
  };

  const drawerContent = selectedTask ? (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/50 dark:bg-[#020B09]/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white h-full border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-[#F4F2EE] dark:bg-[#041F18]/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#728974] dark:text-[#00F5A0]">{selectedTask.id}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#E8EFE9] text-[#5E7160] border border-emerald-200/50 font-heading font-bold">
              {selectedTask.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectTask(null)}
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Drawer Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-[#8A8A8A] mb-1 block">
              Task Title
            </label>
            <Input
              value={selectedTask.title}
              onChange={(e) => updateTask(selectedTask.id, { title: e.target.value })}
              className="font-heading font-bold text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              options={[
                { value: 'Backlog', label: 'Backlog' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Review', label: 'Review' },
                { value: 'Done', label: 'Done' },
              ]}
              value={selectedTask.status}
              onChange={(val) => updateTask(selectedTask.id, { status: val as TaskStatus })}
            />

            <Select
              label="Priority"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
              value={selectedTask.priority}
              onChange={(val) => updateTask(selectedTask.id, { priority: val as TaskPriority })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F2EE] dark:bg-[#041F18] border border-slate-200/50 dark:border-white/10">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase text-[#8A8A8A] block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-[#728974]" /> Assignee
              </span>
              <div className="flex items-center gap-1.5">
                <img src={selectedTask.assignee.avatar} alt="" className="w-5 h-5 rounded-full border border-slate-200" />
                <span className="text-xs font-semibold text-[#1C1C1C] dark:text-white truncate">
                  {selectedTask.assignee.name}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-heading font-bold uppercase text-[#8A8A8A] block mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#728974]" /> Story Points
              </span>
              <input
                type="number"
                min="1"
                max="13"
                value={selectedTask.storyPoints}
                onChange={(e) => updateTask(selectedTask.id, { storyPoints: Number(e.target.value) || 1 })}
                className="w-16 h-7 px-2 text-xs font-bold bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <span className="text-[10px] font-heading font-bold uppercase text-[#8A8A8A] block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#728974]" /> Due Date
              </span>
              <input
                type="date"
                value={selectedTask.dueDate}
                onChange={(e) => updateTask(selectedTask.id, { dueDate: e.target.value })}
                className="h-7 px-1 text-[11px] font-medium bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-heading font-bold text-[#1C1C1C] dark:text-white">
              Comments ({selectedTask.comments.length})
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="text-xs"
              />
              <Button type="submit" variant="primary" size="sm">
                <Send className="w-3.5 h-3.5 text-white" />
              </Button>
            </form>

            <div className="space-y-3">
              {selectedTask.comments.map((comment) => (
                <div key={comment.id} className="p-3.5 rounded-2xl bg-[#F4F2EE] dark:bg-[#041F18]/60 border border-slate-200/50 dark:border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-[#1C1C1C] dark:text-white font-heading">{comment.author}</span>
                    <span className="text-[10px] text-[#8A8A8A]">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-[#A1A1AA]">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C1C1C] dark:text-white tracking-tight">
            Sprint Board
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Enterprise drag-and-drop workspace for Sprint 24 task cards
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F2EE] dark:bg-[#041F18] text-[#1C1C1C] dark:text-white rounded-full border border-transparent focus:border-[#728974] focus:ring-1 focus:ring-[#728974] focus:outline-none transition-all placeholder:text-[#8A8A8A]"
            />
          </div>

          <div className="w-36">
            <Select
              options={[
                { value: 'All', label: 'All Priorities' },
                { value: 'Urgent', label: 'Urgent' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
              value={filters.priority}
              onChange={(val) => setPriorityFilter(val as TaskPriority | 'All')}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={historyStack.length === 0}
            onClick={handleUndo}
            title="Undo last drag/drop action"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1 text-[#728974]" /> Undo
          </Button>

          {(filters.searchQuery || filters.priority !== 'All' || filters.assigneeId !== 'All') && (
            <Button variant="ghost" size="sm" onClick={resetFilters} title="Reset filters">
              <Filter className="w-4 h-4" />
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={resetToInitialTasks} title="Reset board to initial 30 tasks">
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#728974]" /> Reset 30 Tasks
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Card
          </Button>
        </div>
      </div>

      {/* Kanban Board Drag Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-[#728974]/30 min-h-[600px]">
          {COLUMNS.map((columnStatus) => (
            <KanbanColumn
              key={columnStatus}
              status={columnStatus}
              tasks={tasksByColumn[columnStatus]}
              onTaskClick={(task) => selectTask(task.id)}
              onAddTaskClick={(status) => {
                setNewTaskStatus(status);
                setIsCreateModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* Dragging Overlay */}
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
      </DndContext>

      {/* Render Side Drawer at document.body level via Portal */}
      {typeof document !== 'undefined' && drawerContent ? createPortal(drawerContent, document.body) : null}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Sprint Task"
        description="Add a new item to the active Sprint 24 backlog"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Implement OAuth2 refresh token telemetry"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Column Status"
              options={[
                { value: 'Backlog', label: 'Backlog' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Review', label: 'Review' },
                { value: 'Done', label: 'Done' },
              ]}
              value={newTaskStatus}
              onChange={(val) => setNewTaskStatus(val as TaskStatus)}
            />

            <Select
              label="Priority"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
              value={newTaskPriority}
              onChange={(val) => setNewTaskPriority(val as TaskPriority)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
            <Input
              label="Story Points"
              type="number"
              min="1"
              max="13"
              value={newTaskStoryPoints}
              onChange={(e) => setNewTaskStoryPoints(Number(e.target.value))}
            />
          </div>

          <Input
            label="Assignee Name"
            value={newTaskAssigneeName}
            onChange={(e) => setNewTaskAssigneeName(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task Confirmation"
        description="Permanently remove task item from active sprint board state?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA]">
          This action will remove <span className="font-mono font-bold text-[#728974]">{selectedTaskId}</span> from the sprint database.
        </p>
      </Modal>
    </div>
  );
};
