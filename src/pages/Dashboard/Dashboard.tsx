import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useBoard } from '../../hooks/useBoard';
import { Button } from '../../components/Button';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { Task } from '../../types/task.types';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  Kanban,
  Flame,
  BarChart2,
  ArrowRight,
  Zap,
  Activity,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { allTasks, tasksByColumn, selectTask } = useBoard();
  const navigate = useNavigate();

  const totalTasksCount = allTasks.length;
  const completedCount = tasksByColumn['Done'].length;
  const inProgressCount = tasksByColumn['In Progress'].length;
  const reviewCount = tasksByColumn['Review'].length;
  const backlogCount = tasksByColumn['Backlog'].length;
  const totalStoryPoints = allTasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedStoryPoints = tasksByColumn['Done'].reduce((sum, t) => sum + t.storyPoints, 0);
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const recentTasks = allTasks.slice(0, 5);

  const columns: ColumnDef<Task>[] = [
    {
      header: 'Task ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-[#728974] dark:text-[#00F5A0]">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Title',
      accessorKey: 'title',
      sortable: true,
      cell: (row) => (
        <span className="font-heading font-bold text-[#1C1C1C] dark:text-white hover:text-[#728974] transition-colors line-clamp-1">
          {row.title}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <span className={clsx('text-[11px] font-heading font-bold px-3 py-1 rounded-full uppercase', getStatusBadgeClass(row.status))}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => (
        <span className={clsx('text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full uppercase', getPriorityBadgeClass(row.priority))}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Assignee',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.assignee.avatar} alt={row.assignee.name} className="w-6 h-6 rounded-full border border-slate-200 object-cover" />
          <span className="text-xs text-[#1C1C1C] dark:text-slate-300 font-medium">{row.assignee.name}</span>
        </div>
      ),
    },
    {
      header: 'Due Date',
      cell: (row) => <span className="text-xs text-[#8A8A8A]">{formatDate(row.dueDate)}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0A1513] rounded-3xl p-6 sm:p-8 text-[#1C1C1C] dark:text-white border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8EFE9] text-[#5E7160] text-xs font-heading font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-[#728974] text-[#728974]" /> Sprint 24 Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Good Morning, {user?.firstName || 'Sprint Master'} 👋
            </h1>
            <p className="text-sm text-[#8A8A8A] mt-1.5 max-w-xl leading-relaxed">
              Sprint 24 telemetry is live. You have completed {completedCount} of {totalTasksCount} tasks ({completedStoryPoints} of {totalStoryPoints} story points).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/board')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Kanban Board
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Sprint */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#8A8A8A] uppercase tracking-wider">Active Sprint</p>
            <h3 className="text-2xl font-heading font-extrabold text-[#1C1C1C] dark:text-white mt-1">Sprint 24</h3>
            <p className="text-[11px] text-[#728974] font-bold mt-1">Ends in 6 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#728974] flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#8A8A8A] uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-heading font-extrabold text-[#728974] mt-1">{completedCount}</h3>
            <p className="text-[11px] text-[#728974] font-bold mt-1">{completionPercentage}% finished</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#728974] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#8A8A8A] uppercase tracking-wider">In Progress</p>
            <h3 className="text-2xl font-heading font-extrabold text-[#F59E0B] mt-1">{inProgressCount}</h3>
            <p className="text-[11px] text-[#F59E0B] font-bold mt-1">Active delivery</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Review */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#8A8A8A] uppercase tracking-wider">Review</p>
            <h3 className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400 mt-1">{reviewCount}</h3>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1">Under QA</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Card 5: Velocity */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#8A8A8A] uppercase tracking-wider">Velocity</p>
            <h3 className="text-2xl font-heading font-extrabold text-[#728974] mt-1">{completedStoryPoints} pts</h3>
            <p className="text-[11px] text-[#8A8A8A] font-bold mt-1">Goal: {totalStoryPoints} pts</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#728974] flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress Bar & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#0A1513] p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white">Sprint 24 Completion Status</h2>
            <span className="text-xs font-heading font-extrabold text-[#5E7160] dark:text-[#00F5A0] px-3 py-1 rounded-full bg-[#E8EFE9] dark:bg-[#00F5A0]/20">{completionPercentage}% Completed</span>
          </div>
          <div className="w-full bg-[#EFECE6] dark:bg-[#041F18] h-3.5 rounded-full overflow-hidden">
            <div
              className="bg-[#728974] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-[#F4F2EE] dark:bg-[#041F18]/50 border border-slate-200/40 dark:border-white/5">
              <span className="block text-[#8A8A8A] font-heading font-bold text-[10px]">BACKLOG</span>
              <span className="font-bold text-[#1C1C1C] dark:text-white text-sm mt-0.5 block">{backlogCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FEF3C7] border border-amber-200/50">
              <span className="block text-[#D97706] font-heading font-bold text-[10px]">IN PROGRESS</span>
              <span className="font-bold text-[#D97706] text-sm mt-0.5 block">{inProgressCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="block text-purple-600 font-heading font-bold text-[10px]">REVIEW</span>
              <span className="font-bold text-purple-600 text-sm mt-0.5 block">{reviewCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#E8EFE9] border border-emerald-200/50">
              <span className="block text-[#5E7160] font-heading font-bold text-[10px]">DONE</span>
              <span className="font-bold text-[#5E7160] text-sm mt-0.5 block">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="bg-white dark:bg-[#0A1513] p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white mb-1">Control Actions</h2>
            <p className="text-xs text-[#8A8A8A]">Direct shortcuts to sprint modules</p>
          </div>
          <div className="space-y-3 my-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/board')}
              leftIcon={<Kanban className="w-4 h-4 text-[#728974]" />}
              className="w-full justify-start text-xs py-3"
            >
              Manage Kanban Board
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/analytics')}
              leftIcon={<BarChart2 className="w-4 h-4 text-[#728974]" />}
              className="w-full justify-start text-xs py-3"
            >
              View Analytics & Charts
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity DataTable */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-[#1C1C1C] dark:text-white">Recent Sprint Activity</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/board')}>
            View All Tasks
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={recentTasks}
          pageSize={5}
          onRowClick={(row) => {
            selectTask(row.id);
            navigate('/board');
          }}
        />
      </div>
    </div>
  );
};
