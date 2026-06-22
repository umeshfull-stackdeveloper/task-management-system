import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { BarChart3, TrendingUp, Layers, Activity, Sparkles, Inbox } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        addToast('Failed to load metrics data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Compute metric calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  const lowCount = tasks.filter((t) => t.priority === 'Low').length;
  const medCount = tasks.filter((t) => t.priority === 'Medium').length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart 1: Priority Distribution Pie Chart
  const pieData = [
    { name: 'Low Priority', value: lowCount, color: '#10b981' }, 
    { name: 'Medium Priority', value: medCount, color: '#f59e0b' },
    { name: 'High Priority', value: highCount, color: '#f43f5e' },
  ].filter((item) => item.value > 0);

  // Chart 2 & 3: Weekly Activity generation (Created vs Completed comparison)
  const getWeeklyMetrics = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({
        dateStr: d.toDateString(),
        dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
        createdCount: 0,
        completedCount: 0,
      });
    }

    tasks.forEach((t) => {
      // Created audits
      const createDateStr = new Date(t.createdAt).toDateString();
      const createMatch = days.find((day) => day.dateStr === createDateStr);
      if (createMatch) createMatch.createdCount += 1;

      // Completed audits
      if (t.status === 'Completed') {
        const completeDateStr = new Date(t.updatedAt || t.createdAt).toDateString();
        const completeMatch = days.find((day) => day.dateStr === completeDateStr);
        if (completeMatch) completeMatch.completedCount += 1;
      }
    });

    return days.map((day) => ({
      day: day.dayLabel,
      Created: day.createdCount,
      Completed: day.completedCount,
    }));
  };

  const weeklyData = getWeeklyMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <Inbox size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
        <h4 className="text-sm font-bold text-slate-850 dark:text-slate-250">No Metrics Available</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
          Analytics dashboard will populate once you begin adding and updating task priorities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="shrink-0">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 size={18} className="text-indigo-500" />
          <span>Analytics & Workspace Metrics</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Real-time charts visualizing priority distributions and completion performance
        </p>
      </div>

      {/* Grid containing the 3 charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Line/Area Chart: Task Completion Trend */}
        <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800/50">
              <TrendingUp size={13} className="text-indigo-500" />
              <span>Completion Velocity</span>
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Completed"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#areaColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2 text-center">
            Trend curve of task stages closures
          </p>
        </div>

        {/* Pie Chart: Priority Distribution */}
        <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800/50">
              <Layers size={13} className="text-purple-500" />
              <span>Priority Allocation</span>
            </h4>
            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{completionRate}%</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Ratio</p>
              </div>
            </div>
          </div>
          {/* Custom legend list */}
          <div className="flex items-center justify-center gap-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-2 shrink-0">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Workspace Efficiency (Created vs Completed daily) */}
        <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800/50">
              <Activity size={13} className="text-emerald-500" />
              <span>Workspace Performance</span>
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="Created" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Custom legend list */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-2 shrink-0">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#818cf8]"></span>
              <span>Tasks Created</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#34d399]"></span>
              <span>Tasks Completed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
