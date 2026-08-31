import React from 'react';
import { Sparkles, X, ArrowRight, Compass, MapPin } from 'lucide-react';

interface OnboardingBannerProps {
  onDismiss: () => void;
  onSelectSampleRoute: (routeId: string) => void;
  onSelectSampleStop: (stopId: string) => void;
  onFindNearMe: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onDismiss,
  onSelectSampleRoute,
  onSelectSampleStop,
  onFindNearMe,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-[#161B22] dark:via-[#161B22] dark:to-[#0D1117] border border-blue-200/80 dark:border-[#30363D] p-4 sm:p-5 shadow-sm transition-all mb-6">
      {/* Subtle decorative glow circle */}
      <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-blue-400/20 dark:bg-[#1F6FEB]/10 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-[#1F6FEB] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-[#F0F6FC]">
                New on Campus? Welcome to CampusRoute!
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-[#1F6FEB]/20 dark:text-[#58A6FF] dark:border dark:border-[#1F6FEB]/30">
                Freshman Guide
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#8B949E] mt-1 max-w-2xl leading-relaxed">
              Tap any bus route below to see its <strong>metro-style stop timeline</strong> and <strong>live arrival countdowns</strong>. You can also tap any specific stop to see every shuttle arriving there.
            </p>

            {/* Quick Demo Action Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
                Try quick demos:
              </span>
              <button
                id="btn-onboarding-route-a"
                onClick={() => onSelectSampleRoute('route-north-loop')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-[#238636]/20 dark:text-[#3FB950] dark:hover:bg-[#238636]/30 border border-emerald-300 dark:border-[#238636]/40 transition-colors cursor-pointer"
              >
                <span>Route A (North Loop)</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                id="btn-onboarding-stop-library"
                onClick={() => onSelectSampleStop('stop-library-circle')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-[#21262D] dark:text-[#C9D1D9] dark:hover:bg-[#30363D] border border-indigo-300 dark:border-[#30363D] transition-colors cursor-pointer"
              >
                <span>Central Library Stop</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                id="btn-onboarding-near-me"
                onClick={onFindNearMe}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-[#1F6FEB]/20 dark:text-[#58A6FF] dark:hover:bg-[#1F6FEB]/30 border border-blue-300 dark:border-[#1F6FEB]/40 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3" />
                <span>Simulate GPS Near Me</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          id="btn-dismiss-onboarding"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:text-[#8B949E] dark:hover:text-[#F0F6FC] p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-[#21262D] transition-colors flex-shrink-0 cursor-pointer"
          title="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
