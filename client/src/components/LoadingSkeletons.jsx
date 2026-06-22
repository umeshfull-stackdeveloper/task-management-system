import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200/50 bg-white p-5 dark:border-slate-800/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5 w-full">
              <div className="h-2 w-16 rounded bg-slate-200 dark:bg-slate-850"></div>
              <div className="h-6 w-10 rounded bg-slate-200 dark:bg-slate-850"></div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-850"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const KanbanSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-4">
      {[1, 2, 3].map((col) => (
        <div key={col} className="rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-850 animate-pulse"></div>
            <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-850 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((card) => (
              <div key={card} className="rounded-2xl bg-white p-5 border border-slate-100 dark:border-slate-800 dark:bg-slate-900/50 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="h-4 w-6 rounded bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
                  <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="h-3.5 w-10 rounded bg-slate-200 dark:bg-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200/50 bg-white p-5 dark:border-slate-800/50 dark:bg-slate-900/50 space-y-2">
          <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
      ))}
    </div>
  );
};
