import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden text-center space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Warning Icon Banner */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
          <AlertTriangle size={24} />
        </div>

        {/* Labels */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">
            {title || 'Are you sure?'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
            {message || 'This action cannot be undone. Do you want to continue?'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-500 dark:border-slate-855 dark:hover:bg-slate-800/50 dark:text-slate-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/10 transition-colors"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
