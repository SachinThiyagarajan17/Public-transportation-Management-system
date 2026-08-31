import React from 'react';
import { Route } from '../types';
import { Clock, Radio, Users, ChevronRight, MapPin, Zap, ArrowRight } from 'lucide-react';

interface RouteCardProps {
  route: Route;
  onSelect: (routeId: string) => void;
  nextEta: { text: string; isImminent: boolean; isBoarding: boolean };
  onOpenStopDetails: (stopId: string) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onSelect,
  nextEta,
  onOpenStopDetails,
}) => {
  return (
    <div
      id={`route-card-${route.id}`}
      onClick={() => onSelect(route.id)}
      className="group relative bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200/90 dark:border-[#30363D] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-[#58A6FF]/60 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Route Color Top Accent Strip */}
      <div
        className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: route.colorHex }}
      />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Route Code Badge, Title, Next ETA */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border ${route.badgeBg}`}
              >
                {route.code}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8B949E] uppercase tracking-wider">
                {route.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-[#3FB950] bg-emerald-50 dark:bg-[#238636]/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-[#238636]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3FB950] animate-pulse" />
                {route.status}
              </span>
            </div>

            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-[#F0F6FC] group-hover:text-[#58A6FF] dark:group-hover:text-[#58A6FF] transition-colors pt-0.5">
              {route.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8B949E] line-clamp-1">
              {route.subtitle}
            </p>
          </div>

          {/* Next Bus Arrival ETA Badge */}
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex flex-col items-end p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D]">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-[#8B949E] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-ping" />
                <span>Next Bus</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`font-display font-extrabold text-base sm:text-lg ${
                    nextEta.isBoarding
                      ? 'text-amber-600 dark:text-[#F0883E] animate-pulse'
                      : nextEta.isImminent
                      ? 'text-emerald-600 dark:text-[#3FB950]'
                      : 'text-slate-900 dark:text-[#F0F6FC]'
                  }`}
                >
                  {nextEta.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Meta Stats (Frequency, Hours, Buses) */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50/80 dark:bg-[#0D1117] border border-slate-100 dark:border-[#21262D] text-xs">
          <div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-[#8B949E] block">
              Frequency
            </span>
            <span className="font-semibold text-slate-800 dark:text-[#E6EDF3]">
              {route.frequency}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-[#8B949E] block">
              Hours
            </span>
            <span className="font-semibold text-slate-800 dark:text-[#E6EDF3] truncate block">
              {route.operatingHours}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-[#8B949E] block">
              Live Fleet
            </span>
            <span className="font-semibold text-slate-800 dark:text-[#E6EDF3] flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: route.colorHex }}
              />
              {route.activeBuses} active
            </span>
          </div>
        </div>

        {/* Route Stops Stepper Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8B949E]">
            <span className="font-semibold text-slate-700 dark:text-[#C9D1D9]">
              Route Path ({route.stops.length} stops)
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#8B949E]">Tap to inspect</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {route.stops.map((stop, idx) => (
              <React.Fragment key={stop.id}>
                <button
                  type="button"
                  id={`btn-stop-preview-${route.id}-${stop.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenStopDetails(stop.id);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    stop.isMajor
                      ? 'bg-slate-100 dark:bg-[#21262D] text-slate-900 dark:text-[#F0F6FC] font-semibold border border-slate-300/80 dark:border-[#30363D] hover:border-blue-400 dark:hover:border-[#58A6FF]'
                      : 'text-slate-600 dark:text-[#8B949E] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#21262D]'
                  }`}
                  title={`${stop.name} (${stop.isMajor ? 'Major Transfer Hub' : 'Campus Stop'}) - Click for all routes`}
                >
                  {stop.isMajor ? '★ ' : ''}
                  {stop.name.split('&')[0].trim()}
                </button>
                {idx < route.stops.length - 1 && (
                  <span className="text-slate-300 dark:text-[#30363D] text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-[#0D1117] border-t border-slate-100 dark:border-[#30363D] flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-[#58A6FF] group-hover:text-blue-700 dark:group-hover:text-[#79B8FF]">
        <span className="flex items-center gap-1">
          <span>View live metro timeline & arrivals</span>
        </span>
        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Explore Route</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
