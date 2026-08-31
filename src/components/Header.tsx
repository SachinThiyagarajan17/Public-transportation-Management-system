import React from 'react';
import { Bus, Moon, Sun, RefreshCw, Radio, MapPin, Sparkles } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onFindNearMe: () => void;
  activeView: 'routes' | 'detail' | 'stops-directory';
  onGoHome: () => void;
  onOpenStopsDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  isRefreshing,
  onRefresh,
  onFindNearMe,
  activeView,
  onGoHome,
  onOpenStopsDirectory,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#30363D] transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-[#1F6FEB] via-[#388BFD] to-[#8957E5] text-white text-xs py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
        <span>Hackathon Demo • Fall 2026 Orientation Edition • Live Shuttle GPS Feed</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <button
          id="btn-brand-home"
          onClick={onGoHome}
          className="flex items-center gap-2.5 group text-left transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F6FEB] to-[#238636] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-[#F0F6FC] group-hover:text-[#58A6FF] dark:group-hover:text-[#58A6FF] transition-colors">
                CampusRoute
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-[#21262D] text-blue-700 dark:text-[#58A6FF] border border-transparent dark:border-[#30363D]">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#8B949E] font-medium hidden sm:block">
              University Bus Explorer & ETA Guide
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Nearest Stop button */}
          <button
            id="btn-header-near-me"
            onClick={onFindNearMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:text-[#58A6FF] border border-blue-200/70 dark:border-[#30363D] transition-all active:scale-95 cursor-pointer"
            title="Locate closest campus stop"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-[#58A6FF]" />
            <span className="hidden xs:inline">Near Me</span>
          </button>

          {/* All Stops Directory toggle */}
          <button
            id="btn-header-stops-dir"
            onClick={onOpenStopsDirectory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
              activeView === 'stops-directory'
                ? 'bg-[#1F6FEB] text-white border-[#388BFD] shadow-sm'
                : 'bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] border-slate-200 dark:border-[#30363D] hover:bg-slate-200 dark:hover:bg-[#21262D]'
            }`}
            title="Browse all stops"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stops Hub</span>
          </button>

          {/* Refresh Feed */}
          <button
            id="btn-header-refresh"
            onClick={onRefresh}
            className="p-2 rounded-lg text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#21262D] bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] transition-all active:scale-95 cursor-pointer"
            title="Refresh live arrival data"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-600 dark:text-[#C9D1D9] ${
                isRefreshing ? 'animate-spin text-[#58A6FF]' : ''
              }`}
            />
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-lg text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#21262D] bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] transition-all active:scale-95 cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-[#F0883E] hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
