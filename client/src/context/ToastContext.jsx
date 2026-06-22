import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add toast helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastIcons = {
    success: <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />,
    error: <AlertCircle className="text-rose-500 shrink-0" size={18} />,
    info: <Info className="text-blue-500 shrink-0" size={18} />,
  };

  const toastBorders = {
    success: 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/10 dark:border-l-emerald-500',
    error: 'border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/10 dark:border-l-rose-500',
    info: 'border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/10 dark:border-l-blue-500',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border border-slate-200/50 border-l-4 bg-white p-4 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 hover:-translate-y-0.5 transition-all duration-200 animate-slide-in ${
              toastBorders[toast.type]
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toastIcons[toast.type]}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed pr-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-650 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 transition-colors shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
