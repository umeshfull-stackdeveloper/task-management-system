import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  PlusCircle,
  Edit,
  Trash2,
  GitCommit,
  Calendar,
  Loader2,
  Inbox,
} from 'lucide-react';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (err) {
      addToast('Failed to load activity logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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
    Created: <PlusCircle className="text-indigo-500" size={16} />,
    Updated: <Edit className="text-amber-500" size={16} />,
    Deleted: <Trash2 className="text-rose-500" size={16} />,
    'Status Changed': <GitCommit className="text-emerald-500" size={16} />,
  };

  const activityBgColors = {
    Created: 'bg-indigo-50/70 dark:bg-indigo-950/15 border-indigo-100/50 dark:border-indigo-900/30',
    Updated: 'bg-amber-50/70 dark:bg-amber-950/15 border-amber-100/50 dark:border-amber-900/30',
    Deleted: 'bg-rose-50/70 dark:bg-rose-950/15 border-rose-100/50 dark:border-rose-900/30',
    'Status Changed': 'bg-emerald-50/70 dark:bg-emerald-950/15 border-emerald-100/50 dark:border-emerald-900/30',
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-indigo-600" />
          <p className="text-xs font-bold text-slate-400">Loading audit records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-slate-800/50">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-500" size={20} />
            <span>Workspace Activity Log</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Audit history of your tasks and workspace actions (up to 50 items)
          </p>
        </div>
      </div>

      {/* Logs list */}
      {activities.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <Inbox size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-550">
            No activity logged yet.
          </p>
          <p className="text-xs text-slate-350 dark:text-slate-500 mt-1">
            Create, edit, or progress tasks on the board to log actions.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 dark:border-slate-800/80 ml-4.5 space-y-6 pt-2">
          {activities.map((act) => (
            <div key={act._id} className="relative pl-6 group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[14px] top-1 flex h-7 w-7 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 ${
                  activityBgColors[act.action] || 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {activityIcons[act.action] || <Activity size={14} />}
              </div>

              {/* Log details */}
              <div className="rounded-2xl border border-slate-200/50 bg-white p-4.5 shadow-sm group-hover:shadow-md group-hover:border-slate-300/40 dark:border-slate-800/50 dark:bg-slate-900/40 dark:group-hover:border-slate-700/40 transition-all duration-200">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {act.action}
                  </span>
                  
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    <Calendar size={11} />
                    {formatActivityTime(act.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {act.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
