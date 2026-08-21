import React, { useMemo } from 'react';
import { useBoardStore } from '../../store/board.store';
import { useThemeStore } from '../../store/theme.store';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TaskPriority, TaskStatus } from '../../types/task.types';

const STATUS_COLORS: Record<TaskStatus, string> = {
  Backlog: '#8A8A8A',
  'In Progress': '#F59E0B',
  Review: '#8B5CF6',
  Done: '#728974',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  Urgent: '#EF4444',
  High: '#728974',
  Medium: '#3B82F6',
  Low: '#8A8A8A',
};

export const Analytics: React.FC = () => {
  const tasks = useBoardStore((state) => state.tasks);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const tooltipBg = isDark ? '#041F18' : '#FFFFFF';
  const tooltipText = isDark ? '#FFFFFF' : '#1C1C1C';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#E5E2DC';
  const axisColor = isDark ? '#A1A1AA' : '#8A8A8A';
  const gridColor = isDark ? '#041F18' : '#EFECE6';

  // 1. Task Status Data
  const statusData = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      Backlog: 0,
      'In Progress': 0,
      Review: 0,
      Done: 0,
    };
    tasks.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return (Object.keys(counts) as TaskStatus[]).map((status) => ({
      name: status,
      value: counts[status],
      color: STATUS_COLORS[status],
    }));
  }, [tasks]);

  // 2. Priority Breakdown Data
  const priorityData = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      Urgent: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };
    tasks.forEach((t) => {
      counts[t.priority] = (counts[t.priority] || 0) + 1;
    });
    return (Object.keys(counts) as TaskPriority[]).map((priority) => ({
      name: priority,
      count: counts[priority],
      color: PRIORITY_COLORS[priority],
    }));
  }, [tasks]);

  // 3. Sprint Velocity Data
  const velocityData = useMemo(() => {
    const currentCompletedPoints = tasks
      .filter((t) => t.status === 'Done')
      .reduce((sum, t) => sum + t.storyPoints, 0);

    const currentTotalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);

    return [
      { sprint: 'Sprint 21', planned: 28, completed: 26 },
      { sprint: 'Sprint 22', planned: 32, completed: 30 },
      { sprint: 'Sprint 23', planned: 35, completed: 34 },
      { sprint: 'Sprint 24 (Active)', planned: currentTotalPoints, completed: currentCompletedPoints },
    ];
  }, [tasks]);

  // 4. Cumulative Completion Trend Data
  const trendData = useMemo(() => {
    return [
      { day: 'Day 1', backlog: 12, inProgress: 8, done: 2 },
      { day: 'Day 3', backlog: 10, inProgress: 10, done: 5 },
      { day: 'Day 5', backlog: 8, inProgress: 9, done: 9 },
      { day: 'Day 7', backlog: 6, inProgress: 8, done: 13 },
      { day: 'Day 9', backlog: 5, inProgress: 6, done: 16 },
      { day: 'Today', backlog: tasks.filter(t => t.status === 'Backlog').length, inProgress: tasks.filter(t => t.status === 'In Progress').length, done: tasks.filter(t => t.status === 'Done').length },
    ];
  }, [tasks]);

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1C1C1C] dark:text-white tracking-tight">
          Sprint Analytics & Metrics
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-0.5">
          Real-time telemetry derived dynamically from active board state
        </p>
      </div>

      {/* Grid of 4 Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sprint Velocity */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white">Sprint Velocity</h2>
            <p className="text-xs text-[#8A8A8A]">Planned vs Completed story points per sprint</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.8} />
                <XAxis dataKey="sprint" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planned" fill="#8A8A8A" radius={[4, 4, 0, 0]} name="Planned Points" />
                <Bar dataKey="completed" fill="#728974" radius={[4, 4, 0, 0]} name="Completed Points" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Task Status Distribution */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white">Task Status Distribution</h2>
            <p className="text-xs text-[#8A8A8A]">Live breakdown of active sprint task statuses</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Priority Breakdown */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white">Priority Breakdown</h2>
            <p className="text-xs text-[#8A8A8A]">Task volume categorized by priority tier</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.8} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }}
                />
                {priorityData.map((entry, index) => (
                  <Bar key={index} dataKey="count" fill={entry.color} radius={[4, 4, 0, 0]} name={entry.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Completion Trend */}
        <div className="bg-white dark:bg-[#0A1513] p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <h2 className="text-base font-heading font-bold text-[#1C1C1C] dark:text-white">Completion Trend</h2>
            <p className="text-xs text-[#8A8A8A]">Cumulative task progression over sprint timeframe</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.8} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="done" stroke="#728974" fill="#728974" fillOpacity={0.25} name="Done" />
                <Area type="monotone" dataKey="inProgress" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} name="In Progress" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
