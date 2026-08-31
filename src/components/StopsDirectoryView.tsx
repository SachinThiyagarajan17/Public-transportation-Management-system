import React, { useState } from 'react';
import { Stop, Route } from '../types';
import { getAllUniqueStops, getRoutesForStop } from '../data/campusRoutes';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Search,
  Building,
  Navigation,
  Accessibility,
  CornerDownRight,
} from 'lucide-react';

interface StopsDirectoryViewProps {
  onSelectStop: (stopId: string) => void;
  onSelectRoute: (routeId: string) => void;
  getEtaForStop: (routeId: string, stopId: string) => {
    seconds: number;
    text: string;
    isImminent: boolean;
    isBoarding: boolean;
  };
}

export const StopsDirectoryView: React.FC<StopsDirectoryViewProps> = ({
  onSelectStop,
  onSelectRoute,
  getEtaForStop,
}) => {
  const [stopFilter, setStopFilter] = useState('');
  const [onlyMajor, setOnlyMajor] = useState(false);
  const allStops = getAllUniqueStops();

  const filteredStops = allStops.filter((stop) => {
    const matchesQuery =
      stop.name.toLowerCase().includes(stopFilter.toLowerCase()) ||
      stop.code.toLowerCase().includes(stopFilter.toLowerCase()) ||
      stop.landmarks.some((l) => l.toLowerCase().includes(stopFilter.toLowerCase()));
    const matchesMajor = !onlyMajor || stop.isMajor;
    return matchesQuery && matchesMajor;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-[#161B22] border border-indigo-200 dark:border-[#30363D] text-indigo-700 dark:text-[#58A6FF] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stop-First Explorer</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-[#F0F6FC]">
          All Campus Bus Stops
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#8B949E] mt-1">
          Know where you are? Select your stop to see every approaching bus route and live arrival times.
        </p>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#8B949E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-stop-directory-search"
            type="text"
            value={stopFilter}
            onChange={(e) => setStopFilter(e.target.value)}
            placeholder="Search stops or buildings..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#E6EDF3] placeholder-slate-400 dark:placeholder-[#8B949E] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#388BFD] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btn-toggle-major-stops-only"
            onClick={() => setOnlyMajor((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              onlyMajor
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-[#8B949E] border-slate-200 dark:border-[#30363D] hover:bg-slate-100 dark:hover:bg-[#21262D] dark:hover:text-[#E6EDF3]'
            }`}
          >
            ★ Major Hubs Only
          </button>
        </div>
      </div>

      {/* Grid of stop cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {filteredStops.map((stop) => {
          const routes = getRoutesForStop(stop.id);

          return (
            <div
              key={stop.id}
              id={`stop-dir-card-${stop.id}`}
              className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200/90 dark:border-[#30363D] p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-[#58A6FF]/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#21262D] text-slate-600 dark:text-[#C9D1D9] border border-transparent dark:border-[#30363D]">
                        {stop.code}
                      </span>
                      {stop.isMajor && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#F0883E] border border-amber-300 dark:border-amber-700/50">
                          ★ Major Hub
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-[#F0F6FC] mt-1">
                      {stop.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onSelectStop(stop.id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#21262D] dark:hover:bg-[#30363D] text-slate-700 dark:text-[#C9D1D9] transition-colors cursor-pointer"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-[#8B949E] line-clamp-2">
                  {stop.description}
                </p>

                {/* Shuttles that stop here */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-[#8B949E] block">
                    Approaching Shuttles:
                  </span>
                  <div className="space-y-1.5">
                    {routes.map((route) => {
                      const eta = getEtaForStop(route.id, stop.id);
                      return (
                        <div
                          key={route.id}
                          onClick={() => onSelectRoute(route.id)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D1117] border border-slate-200/60 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#58A6FF]/60 cursor-pointer text-xs group"
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: route.colorHex }}
                            />
                            <span className="font-semibold text-slate-800 dark:text-[#E6EDF3] group-hover:text-blue-600 dark:group-hover:text-[#58A6FF]">
                              {route.code}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              eta.isBoarding
                                ? 'text-amber-600 dark:text-[#F0883E]'
                                : eta.isImminent
                                ? 'text-emerald-600 dark:text-[#3FB950]'
                                : 'text-slate-700 dark:text-[#C9D1D9]'
                            }`}
                          >
                            {eta.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-[#30363D] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-[#8B949E]">
                  {routes.length} active {routes.length === 1 ? 'line' : 'lines'}
                </span>
                <button
                  id={`btn-open-stop-hub-${stop.id}`}
                  onClick={() => onSelectStop(stop.id)}
                  className="text-xs font-semibold text-blue-600 dark:text-[#58A6FF] hover:underline cursor-pointer"
                >
                  Open Stop Hub →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
