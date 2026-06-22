import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { CardSkeleton } from '../components/LoadingSkeletons';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  GitCommit,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const Dashboard = ({
  triggerFetchFlag,
  setTriggerFetchFlag,
  taskToEdit,
  setTaskToEdit,
  isTaskModalOpen,
  setIsTaskModalOpen,
}) => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, activitiesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/activities'),
      ]);
      setTasks(tasksRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [triggerFetchFlag]);

  // Handle task status changes
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
      addToast(`Task moved to ${newStatus}`, 'success');
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to update task status.', 'error');
    }
  };

  // Trigger Delete modal
  const handleDeleteTrigger = (id) => {
    setTaskToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    try {
      await api.delete(`/task-delete-confirm/${taskToDeleteId}`); // Note: standard endpoint
    } catch (err) {
      // standard delete
      try {
        await api.delete(`/tasks/${taskToDeleteId}`);
        setTasks((prev) => prev.filter((t) => t._id !== taskToDeleteId));
        addToast('Task deleted successfully', 'success');
        setTriggerFetchFlag((prev) => !prev);
      } catch (e) {
        addToast('Failed to delete task', 'error');
      }
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDeleteId(null);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (taskToEdit) {
        const response = await api.put(`/tasks/${taskToEdit._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? response.data : t))
        );
        addToast('Task details updated', 'success');
      } else {
        const response = await api.post('/tasks', taskData);
        setTasks((prev) => [response.data, ...prev]);
        addToast('Task created successfully', 'success');
      }
      setTriggerFetchFlag((prev) => !prev);
    } catch (err) {
      addToast('Failed to save task details.', 'error');
    }
  };

  // Statistics computations
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'Completed') return false;
    return new Date(t.dueDate).setHours(23, 59, 59, 999) < new Date().getTime();
  });
  const overdueCount = overdueTasks.length;

  const productivityRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart data generation
  const getWeeklyData = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({
        dateStr: d.toDateString(),
        dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0,
      });
    }

    tasks.forEach((t) => {
      if (t.status === 'Completed') {
        const updateDate = new Date(t.updatedAt || t.createdAt).toDateString();
        const match = days.find((day) => day.dateStr === updateDate);
        if (match) match.count += 1;
      }
    });

    return days.map((day) => ({
      day: day.dayLabel,
      completed: day.count,
    }));
  };

  const chartData = getWeeklyData();

  // Activity Feed Formatting Helpers
  const formatActivityTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activityIcons = {
    Created: <PlusCircle className="text-indigo-500" size={14} />,
    Updated: <Edit className="text-amber-500" size={14} />,
    Deleted: <Trash2 className="text-rose-500" size={14} />,
    'Status Changed': <GitCommit className="text-emerald-500" size={14} />,
  };

  const activityBgs = {
    Created: 'bg-indigo-50/70 dark:bg-indigo-950/15 border-indigo-100/30 dark:border-indigo-900/30',
    Updated: 'bg-amber-50/70 dark:bg-amber-950/15 border-amber-100/30 dark:border-amber-900/30',
    Deleted: 'bg-rose-50/70 dark:bg-rose-950/15 border-rose-100/30 dark:border-rose-900/30',
    'Status Changed': 'bg-emerald-50/70 dark:bg-emerald-950/15 border-emerald-100/30 dark:border-emerald-900/30',
  };

  // 6 KPI Cards definition
  const kpiCards = [
    { name: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'border-t-blue-500', text: 'text-blue-500 bg-blue-50/50 dark:bg-blue-950/15' },
    { name: 'Pending', value: pendingTasks, icon: Clock, color: 'border-t-amber-500', text: 'text-amber-500 bg-amber-50/50 dark:bg-amber-950/15' },
    { name: 'In Progress', value: inProgressTasks, icon: TrendingUp, color: 'border-t-indigo-500', text: 'text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/15' },
    { name: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'border-t-emerald-500', text: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/15' },
    { name: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'border-t-rose-500', text: 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/15' },
    { name: 'Productivity Rate', value: `${productivityRate}%`, icon: Sparkles, color: 'border-t-purple-500', text: 'text-purple-500 bg-purple-50/50 dark:bg-purple-950/15' },
  ];

  // Latest 3 active tasks for the Dashboard view
  const recentTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-72 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse"></div>
          <div className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/50 border-t-4 bg-white p-4.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800/50 dark:bg-slate-900/50 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {stat.name}
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-800 dark:text-slate-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-2 shrink-0 ${stat.text}`}>
                  <Icon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Analytics Chart & Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Panel */}
          {totalTasks > 0 ? (
            <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-indigo-500" />
                <span>Completion Velocity (Last 7 Days)</span>
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#dashGrad)"
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
              <Sparkles className="mx-auto text-indigo-500/50 mb-3" size={32} />
              <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Start your first project</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Create tasks to start tracking metrics, charts, and activity records in real-time.
              </p>
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                className="mt-4 flex inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow shadow-indigo-600/10 hover:brightness-110 transition-all"
              >
                <Plus size={14} />
                <span>Create Task</span>
              </button>
            </div>
          )}

          {/* Recent Tasks List */}
          {recentTasks.length > 0 && (
            <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <ListTodo size={13} className="text-blue-500" />
                  <span>My Active Work</span>
                </h4>
                <button
                  onClick={() => navigate('/tasks')}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>All Tasks</span>
                  <ArrowRight size={11} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteTrigger}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Overdue alerts & Activity Timeline Feed */}
        <div className="space-y-6">
          
          {/* Overdue alerts */}
          {overdueCount > 0 && (
            <div className="rounded-3xl border border-rose-200/60 bg-rose-50/40 p-5 dark:border-rose-900/30 dark:bg-rose-950/10">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={17} />
                <div>
                  <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                    Overdue Attention
                  </h4>
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-500 leading-normal">
                    You have {overdueCount} task{overdueCount > 1 ? 's' : ''} past due. Fix these due dates or mark them done.
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {overdueTasks.slice(0, 2).map((t) => (
                      <span
                        key={t._id}
                        onClick={() => handleEditClick(t)}
                        className="cursor-pointer text-left block rounded-lg bg-rose-100/50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 border border-rose-200/30 dark:border-rose-900/30 px-2.5 py-1.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 truncate transition-colors"
                      >
                        {t.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Activity Feed */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-slate-800/50">
              <Activity size={13} className="text-purple-500" />
              <span>Workspace Activity Feed</span>
            </h4>

            {activities.length === 0 ? (
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-center py-12">
                No logs recorded yet.
              </p>
            ) : (
              <div className="relative border-l border-slate-200 dark:border-slate-800/80 ml-3.5 space-y-4 max-h-[380px] overflow-y-auto pt-1.5 pr-1 scroll-thin">
                {activities.slice(0, 6).map((act) => (
                  <div key={act._id} className="relative pl-5.5">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-lg border shadow-sm ${
                        activityBgs[act.action] || 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {activityIcons[act.action] || <Activity size={10} />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400">
                          {act.action}
                        </span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 flex items-center gap-0.5 font-medium">
                          {formatActivityTime(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed truncate-2">
                        {act.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* universal create modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleModalSubmit}
        taskToEdit={taskToEdit}
      />

      {/* delete confirm modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;
