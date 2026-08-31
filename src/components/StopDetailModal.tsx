import React from 'react';
import { Stop, Route } from '../types';
import {
  X,
  MapPin,
  Clock,
  Navigation,
  Accessibility,
  ArrowRight,
  Sparkles,
  Radio,
  CheckCircle,
  Building,
} from 'lucide-react';
import { getRoutesForStop } from '../data/campusRoutes';

interface StopDetailModalProps {
  stop: Stop;
  onClose: () => void;
  onSelectRoute: (routeId: string) => void;
  getEtaForStop: (routeId: string, stopId: string) => {
    seconds: number;
    text: string;
    isImminent: boolean;
    isBoarding: boolean;
  };
}

export const StopDetailModal: React.FC<StopDetailModalProps> = ({
  stop,
  onClose,
  onSelectRoute,
  getEtaForStop,
}) => {
  const routes = getRoutesForStop(stop.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="stop-detail-modal"
        className="relative w-full max-w-lg bg-white dark:bg-[#161B22] rounded-3xl border border-slate-200 dark:border-[#30363D] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117] dark:border-b dark:border-[#30363D] text-white flex-shrink-0">
          <button
            id="btn-close-stop-modal"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/20 dark:bg-[#21262D] text-white dark:text-[#C9D1D9] border border-transparent dark:border-[#30363D]">
                {stop.code}
              </span>
              {stop.isMajor && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400/20 dark:bg-amber-950/60 text-amber-300 dark:text-[#F0883E] border border-amber-400/30 dark:border-amber-700/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Major Interchange Hub
                </span>
              )}
              {stop.accessible && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-400/20 dark:bg-[#1F6FEB]/20 text-blue-300 dark:text-[#58A6FF] border border-transparent dark:border-[#1F6FEB]/40 flex items-center gap-1">
                  <Accessibility className="w-3 h-3" />
                  Wheelchair Accessible
                </span>
              )}
            </div>

            <h2 className="font-display font-extrabold text-2xl text-white dark:text-[#F0F6FC]">
              {stop.name}
            </h2>
            <p className="text-xs text-slate-300 dark:text-[#8B949E] leading-relaxed">
              {stop.description}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Nearby Key Landmarks */}
          {stop.landmarks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#8B949E] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                Nearby Campus Buildings & Landmarks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stop.landmarks.map((landmark, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0D1117] text-slate-700 dark:text-[#C9D1D9] border border-slate-200/80 dark:border-[#30363D]"
                  >
                    📍 {landmark}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Shuttles that Stop Here (Stop-first feature) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">
                All Shuttles Stopping Here ({routes.length})
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-[#3FB950] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3FB950] animate-pulse" />
                Live Countdown
              </span>
            </div>

            <div className="space-y-2.5">
              {routes.map((route) => {
                const eta = getEtaForStop(route.id, stop.id);
                return (
                  <div
                    key={route.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-[#58A6FF]/60 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-10 rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: route.colorHex }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-extrabold px-2 py-0.5 rounded border ${route.badgeBg}`}
                          >
                            {route.code}
                          </span>
                          <span className="font-display font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                            {route.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#8B949E] mt-1">
                          Frequency: {route.frequency} • {route.operatingHours}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-2xs">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            eta.isBoarding
                              ? 'bg-amber-500 animate-ping'
                              : eta.isImminent
                              ? 'bg-emerald-500 dark:bg-[#3FB950] animate-pulse'
                              : 'bg-blue-500 dark:bg-[#58A6FF]'
                          }`}
                        />
                        <span
                          className={`font-display font-extrabold text-xs sm:text-sm ${
                            eta.isBoarding
                              ? 'text-amber-600 dark:text-[#F0883E]'
                              : eta.isImminent
                              ? 'text-emerald-600 dark:text-[#3FB950]'
                              : 'text-slate-900 dark:text-[#F0F6FC]'
                          }`}
                        >
                          {eta.text}
                        </span>
                      </div>

                      <button
                        id={`btn-modal-select-route-${route.id}`}
                        onClick={() => {
                          onClose();
                          onSelectRoute(route.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-[#58A6FF] hover:text-blue-700 dark:hover:text-[#79B8FF] hover:underline cursor-pointer"
                      >
                        <span>View Route</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D1117] border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between text-xs text-slate-500 dark:text-[#8B949E] flex-shrink-0">
          <span>Transit Hub Data • Fall 2026</span>
          <button
            id="btn-close-stop-modal-footer"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#21262D] dark:hover:bg-[#30363D] text-white dark:text-[#F0F6FC] border border-transparent dark:border-[#30363D] font-semibold cursor-pointer transition-colors"
          >
            Close Stop Hub
          </button>
        </div>
      </div>
    </div>
  );
};
