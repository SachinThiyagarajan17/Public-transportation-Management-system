import React, { useState } from 'react';
import { Route, Stop, ActiveBusLocation } from '../types';
import {
  ArrowLeft,
  Clock,
  Radio,
  Bell,
  BellRing,
  Share2,
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bus,
  Accessibility,
  CornerDownRight,
} from 'lucide-react';
import { getRoutesForStop } from '../data/campusRoutes';

interface RouteDetailViewProps {
  route: Route;
  onBack: () => void;
  getEtaForStop: (routeId: string, stopId: string) => {
    seconds: number;
    text: string;
    isImminent: boolean;
    isBoarding: boolean;
  };
  activeBuses: ActiveBusLocation[];
  onOpenStopDetails: (stopId: string) => void;
  onSwitchRoute: (routeId: string) => void;
}

export const RouteDetailView: React.FC<RouteDetailViewProps> = ({
  route,
  onBack,
  getEtaForStop,
  activeBuses,
  onOpenStopDetails,
  onSwitchRoute,
}) => {
  const [alertActive, setAlertActive] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleAlert = (stopId: string) => {
    setAlertActive((prev) => ({
      ...prev,
      [stopId]: !prev[stopId],
    }));
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find active bus on this route
  const currentRouteBus = activeBuses.find((b) => b.routeId === route.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <button
          id="btn-back-to-routes"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#21262D] text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Campus Routes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-share-route"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#21262D] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Share route link"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3FB950]" />
                <span className="text-emerald-600 dark:text-[#3FB950] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-[#8B949E]" />
                <span>Share Route</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Route Card with Distinct Color Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200/90 dark:border-[#30363D] shadow-sm">
        {/* Top brand color strip */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: route.colorHex }}
        />

        <div className="p-5 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold tracking-wide border ${route.badgeBg}`}
                >
                  {route.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#21262D] text-slate-700 dark:text-[#C9D1D9] border border-transparent dark:border-[#30363D]">
                  {route.category} Service
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-[#3FB950] bg-emerald-50 dark:bg-[#238636]/20 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-[#238636]/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#3FB950] animate-pulse" />
                  Live GPS Active
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-[#F0F6FC]">
                {route.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-[#8B949E] max-w-2xl leading-relaxed">
                {route.description}
              </p>
            </div>

            {/* Live Active Bus Status Indicator */}
            {currentRouteBus && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center gap-3 flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg text-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: route.colorHex }}
                >
                  <Bus className="w-5 h-5 animate-bus-bob" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-[#F0F6FC] flex items-center gap-1.5">
                    <span>{currentRouteBus.busNumber} En Route</span>
                    <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-ping" />
                  </div>
                  <div className="text-slate-500 dark:text-[#8B949E] mt-0.5">
                    Next Stop: <span className="font-semibold text-slate-700 dark:text-[#E6EDF3]">{currentRouteBus.nextStopName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#8B949E] mt-0.5">
                    Crowd: <span className="font-semibold text-slate-600 dark:text-[#C9D1D9]">{currentRouteBus.occupancy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Route Meta Specs (Frequency, Hours, Stops, Duration) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-[#30363D] text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-transparent dark:border-[#21262D]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#8B949E] block">
                Frequency
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-[#E6EDF3] mt-0.5 block">
                {route.frequency}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-transparent dark:border-[#21262D]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#8B949E] block">
                Operating Hours
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-[#E6EDF3] mt-0.5 block truncate">
                {route.operatingHours}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-transparent dark:border-[#21262D]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#8B949E] block">
                Total Duration
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-[#E6EDF3] mt-0.5 block">
                {route.totalDuration}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-transparent dark:border-[#21262D]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#8B949E] block">
                Route Stops
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-[#E6EDF3] mt-0.5 block">
                {route.stops.length} campus stops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Centerpiece: Metro-Style Vertical Interactive Timeline */}
      <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200/90 dark:border-[#30363D] shadow-sm p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-[#30363D]">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-[#F0F6FC] flex items-center gap-2">
              <span>Interactive Metro Line & Live ETAs</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#238636]/20 dark:text-[#3FB950] border border-transparent dark:border-[#238636]/40">
                Updating every second
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">
              Tap any stop to see all other shuttles serving it or inspect walking directions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#8B949E]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-slate-900 dark:border-white bg-white dark:bg-[#161B22] inline-block" />
              <span>Major Hub</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-[#8B949E] inline-block" />
              <span>Local Stop</span>
            </span>
          </div>
        </div>

        {/* The Metro Timeline Container */}
        <div className="relative pt-6 pl-3 sm:pl-6 max-w-3xl">
          {/* Continuous vertical transit line bar */}
          <div
            className="absolute left-6 sm:left-9 top-10 bottom-10 w-2.5 rounded-full -translate-x-1/2 shadow-inner transition-colors duration-500"
            style={{ backgroundColor: route.colorHex }}
          />

          {/* Stops loop */}
          <div className="space-y-7 relative">
            {route.stops.map((stop, index) => {
              const eta = getEtaForStop(route.id, stop.id);
              const otherRoutes = getRoutesForStop(stop.id).filter(
                (r) => r.id !== route.id
              );
              const isBusHere =
                currentRouteBus?.currentStopIndex === index;
              const hasAlert = alertActive[stop.id];

              return (
                <div
                  key={stop.id}
                  id={`timeline-stop-${stop.id}`}
                  className="group relative flex items-start gap-4 sm:gap-6 pl-0"
                >
                  {/* Timeline Stop Node (Metro Bullet) */}
                  <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 mt-1.5">
                    {/* Simulated live active bus badge riding the line */}
                    {isBusHere && (
                      <div
                        className="absolute -left-7 sm:-left-9 -top-2 flex items-center justify-center p-1.5 rounded-xl bg-slate-900 dark:bg-[#0D1117] text-white shadow-lg border border-white/20 dark:border-[#30363D] animate-bounce"
                        title={`${currentRouteBus.busNumber} is here!`}
                      >
                        <Bus className="w-4 h-4 text-[#3FB950]" />
                      </div>
                    )}

                    {stop.isMajor ? (
                      <div
                        className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white dark:bg-[#161B22] flex items-center justify-center shadow-md cursor-pointer group-hover:scale-110 transition-transform"
                        style={{ border: `3.5px solid ${route.colorHex}` }}
                        onClick={() => onOpenStopDetails(stop.id)}
                      >
                        <div
                          className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full"
                          style={{ backgroundColor: route.colorHex }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-full bg-white dark:bg-[#161B22] border-2 border-slate-400 dark:border-[#8B949E] group-hover:border-slate-800 dark:group-hover:border-[#F0F6FC] group-hover:scale-125 transition-all cursor-pointer shadow-xs"
                        onClick={() => onOpenStopDetails(stop.id)}
                      />
                    )}
                  </div>

                  {/* Stop Information & Interactive Card */}
                  <div className="flex-1 bg-slate-50/70 hover:bg-slate-100/90 dark:bg-[#0D1117] dark:hover:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] rounded-2xl p-4 sm:p-5 transition-all shadow-xs group-hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Stop Name & Details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            id={`btn-stop-title-${stop.id}`}
                            onClick={() => onOpenStopDetails(stop.id)}
                            className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-[#F0F6FC] hover:text-blue-600 dark:hover:text-[#58A6FF] text-left transition-colors cursor-pointer"
                          >
                            {stop.name}
                          </button>

                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-[#21262D] text-slate-700 dark:text-[#C9D1D9] border border-transparent dark:border-[#30363D]">
                            {stop.code}
                          </span>

                          {stop.isMajor && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#F0883E] border border-amber-300 dark:border-amber-700/50">
                              ★ Major Hub
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-[#8B949E] leading-relaxed">
                          {stop.description}
                        </p>

                        {/* Landmarks tags */}
                        {stop.landmarks.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-medium text-slate-400 dark:text-[#8B949E]">
                              Nearby:
                            </span>
                            {stop.landmarks.map((landmark, lIdx) => (
                              <span
                                key={lIdx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#C9D1D9]"
                              >
                                {landmark}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Live ETA Countdown badge & Alert Toggle */}
                      <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-[#30363D]/60">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-xs">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                eta.isBoarding
                                  ? 'bg-amber-500 animate-ping'
                                  : eta.isImminent
                                  ? 'bg-[#3FB950] animate-pulse'
                                  : 'bg-[#58A6FF]'
                              }`}
                            />
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-[#8B949E] uppercase tracking-wider hidden xs:inline">
                              {eta.isBoarding ? 'Boarding' : 'ETA'}
                            </span>
                            <span
                              className={`font-display font-extrabold text-sm sm:text-base ${
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

                          {/* Demo Notification Alert button */}
                          <button
                            id={`btn-alert-${stop.id}`}
                            onClick={() => toggleAlert(stop.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              hasAlert
                                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-[#F0883E] shadow-xs'
                                : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-400 dark:text-[#8B949E] hover:text-slate-700 dark:hover:text-[#F0F6FC]'
                            }`}
                            title={
                              hasAlert
                                ? 'Arrival reminder set!'
                                : 'Notify me when bus is 2 min away'
                            }
                          >
                            {hasAlert ? (
                              <BellRing className="w-4 h-4 text-amber-500 dark:text-[#F0883E] animate-bounce" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {hasAlert && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-[#F0883E]">
                            ✓ Alert active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Transfers / Connecting Routes Pill Box */}
                    {otherRoutes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-[#30363D]/70 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8B949E] flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3" />
                          <span>Transfer to:</span>
                        </span>

                        {otherRoutes.map((oRoute) => {
                          const oEta = getEtaForStop(oRoute.id, stop.id);
                          return (
                            <button
                              key={oRoute.id}
                              id={`btn-transfer-${stop.id}-${oRoute.id}`}
                              onClick={() => onSwitchRoute(oRoute.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] transition-all cursor-pointer shadow-xs active:scale-95"
                              title={`Switch view to ${oRoute.name} (Next bus in ${oEta.text})`}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: oRoute.colorHex }}
                              />
                              <span>{oRoute.code}</span>
                              <span className="text-[10px] text-slate-500 dark:text-[#8B949E] font-mono">
                                ({oEta.text})
                              </span>
                            </button>
                          );
                        })}

                        <button
                          id={`btn-open-hub-${stop.id}`}
                          onClick={() => onOpenStopDetails(stop.id)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-[#58A6FF] hover:underline ml-auto cursor-pointer"
                        >
                          Explore stop hub →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
