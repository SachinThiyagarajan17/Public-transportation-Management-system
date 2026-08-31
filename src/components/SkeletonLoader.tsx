import React from 'react';

export const RouteListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] p-6 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-20 h-6 bg-slate-200 dark:bg-[#21262D] rounded-lg" />
            <div className="w-16 h-8 bg-slate-200 dark:bg-[#21262D] rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-5 bg-slate-200 dark:bg-[#21262D] rounded" />
            <div className="w-1/2 h-3 bg-slate-200 dark:bg-[#21262D] rounded" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-slate-100 dark:bg-[#0D1117] rounded-lg border border-transparent dark:border-[#21262D]" />
            <div className="h-10 bg-slate-100 dark:bg-[#0D1117] rounded-lg border border-transparent dark:border-[#21262D]" />
            <div className="h-10 bg-slate-100 dark:bg-[#0D1117] rounded-lg border border-transparent dark:border-[#21262D]" />
          </div>
          <div className="h-4 w-5/6 bg-slate-100 dark:bg-[#21262D] rounded" />
        </div>
      ))}
    </div>
  );
};

export const DisclaimerBadge: React.FC = () => {
  return (
    <div className="py-6 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200/90 dark:border-[#30363D] text-[11px] text-slate-500 dark:text-[#8B949E] font-medium shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB]" />
        <span>Simulated live data for demo purposes • University Transit Telemetry v2.4</span>
      </div>
    </div>
  );
};
