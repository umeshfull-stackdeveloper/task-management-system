import React from 'react';
import { Calendar, AlertCircle, Edit, Trash2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onDragStart, onDragEnd }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  // Badge styles based on Priority
  const priorityStyles = {
    Low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
  };

  // Badge styles based on Status
  const statusStyles = {
    Pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'In Progress': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
    Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
  };

  const isOverdue = () => {
    if (!dueDate || status === 'Completed') return false;
    return new Date(dueDate).setHours(23, 59, 59, 999) < new Date().getTime();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Left border color based on priority for SaaS look
  const priorityBorders = {
    Low: 'border-l-[5px] border-l-emerald-500',
    Medium: 'border-l-[5px] border-l-amber-500',
    High: 'border-l-[5px] border-l-rose-500',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onDragEnd={(e) => onDragEnd && onDragEnd(e)}
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800/50 dark:bg-slate-900/50 cursor-grab active:cursor-grabbing ${priorityBorders[priority]}`}
    >
      <div>
        {/* Header: Priority & Action Icons */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              priorityStyles[priority]
            }`}
          >
            {priority}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
              title="Edit Task"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(_id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Task Info */}
        <h4 className="mt-3.5 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
          {title}
        </h4>
        {description && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800/50 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          {/* Due Date Indicator */}
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue()
                ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {isOverdue() ? <AlertCircle size={13} /> : <Calendar size={13} />}
            <span>{formatDate(dueDate)}</span>
            {isOverdue() && <span className="text-[9px] font-bold uppercase tracking-wider ml-1">Overdue</span>}
          </div>

          {/* Status Badge */}
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              statusStyles[status]
            }`}
          >
            {status}
          </span>
        </div>

        {/* Quick Transition Actions */}
        {onStatusChange && (
          <div className="flex items-center justify-end gap-1.5 border-t border-dashed border-slate-100 pt-2.5 dark:border-slate-800/50">
            {status === 'Pending' && (
              <button
                onClick={() => onStatusChange(_id, 'In Progress')}
                className="flex items-center gap-1 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 border border-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30 transition-all"
              >
                <span>Start Task</span>
                <ArrowRight size={11} />
              </button>
            )}
            {status === 'In Progress' && (
              <>
                <button
                  onClick={() => onStatusChange(_id, 'Pending')}
                  className="flex items-center gap-1 rounded-lg hover:bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 border border-slate-200 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-700 transition-all"
                >
                  <ArrowLeft size={11} />
                  <span>Defer</span>
                </button>
                <button
                  onClick={() => onStatusChange(_id, 'Completed')}
                  className="flex items-center gap-1 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30 transition-all"
                >
                  <CheckCircle size={11} />
                  <span>Complete</span>
                </button>
              </>
            )}
            {status === 'Completed' && (
              <button
                onClick={() => onStatusChange(_id, 'In Progress')}
                className="flex items-center gap-1 rounded-lg hover:bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 border border-slate-200 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-700 transition-all"
              >
                <span>Reopen</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
