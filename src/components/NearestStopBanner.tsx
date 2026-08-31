import React from 'react';
import { MapPin, Navigation, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { Stop, Route } from '../types';
import { getRoutesForStop } from '../data/campusRoutes';

interface NearestStopBannerProps {
  stop: Stop;
  distanceMeters: number;
  onSelectRoute: (routeId: string) => void;
  onOpenStopDetails: (stopId: string) => void;
  onClose: () => void;
  getEtaForStop: (routeId: string, stopId: string) => { text: string; isImminent: boolean; isBoarding: boolean };
}

export const NearestStopBanner: React.FC<NearestStopBannerProps> = ({
  stop,
  distanceMeters,
  onSelectRoute,
  onOpenStopDetails,
  onClose,
  getEtaForStop,
}) => {
  const routes = getRoutesForStop(stop.id);
  const walkMinutes = Math.max(1, Math.round(distanceMeters / 75));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 dark:from-[#161B22] dark:via-[#0D1117] dark:to-[#161B22] text-white p-4 sm:p-5 shadow-lg border border-blue-700/50 dark:border-[#30363D] mb-6 animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Background visual accents */}
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-500/10 dark:from-[#1F6FEB]/10 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/30 dark:bg-[#1F6FEB]/20 border border-blue-400/40 dark:border-[#1F6FEB]/40 text-blue-300 dark:text-[#58A6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Navigation className="w-5 h-5 text-blue-300 dark:text-[#58A6FF] animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 dark:bg-[#1F6FEB]/20 text-blue-200 dark:text-[#58A6FF] border border-blue-400/30 dark:border-[#1F6FEB]/30">
                GPS Location Detected
              </span>
              <span className="text-xs text-blue-200/90 dark:text-[#8B949E] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400 dark:text-[#58A6FF]" />
                {distanceMeters}m away • ~{walkMinutes} min walk
              </span>
            </div>

            <h3 className="font-display font-bold text-lg sm:text-xl text-white dark:text-[#F0F6FC]">
              Closest Stop: {stop.name}
            </h3>
            <p className="text-xs text-slate-300 dark:text-[#8B949E] max-w-xl">
              {stop.description}
            </p>

            {/* Routes passing through this stop */}
            <div className="pt-2">
              <span className="text-xs font-medium text-blue-200 dark:text-[#8B949E] block mb-1.5">
                Shuttles arriving at this stop:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {routes.map((route) => {
                  const eta = getEtaForStop(route.id, stop.id);
                  return (
                    <button
                      key={route.id}
                      id={`btn-near-route-${route.id}`}
                      onClick={() => onSelectRoute(route.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-[#21262D] dark:hover:bg-[#30363D] border border-white/15 dark:border-[#30363D] text-xs font-semibold text-white dark:text-[#E6EDF3] transition-all cursor-pointer group active:scale-95"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: route.colorHex }}
                      />
                      <span>{route.code}</span>
                      <span className="text-blue-200 dark:text-[#58A6FF] font-mono text-[11px] bg-black/30 dark:bg-[#0D1117] dark:border dark:border-[#30363D] px-1.5 py-0.5 rounded">
                        {eta.text}
                      </span>
                    </button>
                  );
                })}

                <button
                  id="btn-view-stop-hub"
                  onClick={() => onOpenStopDetails(stop.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-[#1F6FEB] dark:hover:bg-[#388BFD] text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Stop Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          id="btn-close-near-banner"
          onClick={onClose}
          className="text-slate-400 hover:text-white dark:text-[#8B949E] dark:hover:text-[#F0F6FC] p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-[#21262D] transition-colors flex-shrink-0 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
