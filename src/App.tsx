import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { OnboardingBanner } from './components/OnboardingBanner';
import { NearestStopBanner } from './components/NearestStopBanner';
import { RouteCard } from './components/RouteCard';
import { RouteDetailView } from './components/RouteDetailView';
import { StopDetailModal } from './components/StopDetailModal';
import { StopsDirectoryView } from './components/StopsDirectoryView';
import { RouteListSkeleton, DisclaimerBadge } from './components/SkeletonLoader';
import { CAMPUS_ROUTES, ALL_STOPS } from './data/campusRoutes';
import { useLiveTransit } from './hooks/useLiveTransit';
import { Stop, Route } from './types';
import { Bus, MapPin, Compass, Search, Sparkles, Navigation, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  // Dark mode state - default to true for Elegant Dark theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusroute_theme');
      if (saved) return saved === 'dark';
      return true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campusroute_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campusroute_theme', 'light');
    }
  }, [darkMode]);

  // View state
  const [activeView, setActiveView] = useState<'routes' | 'detail' | 'stops-directory'>('routes');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Nearest stop simulation state
  const [nearestResult, setNearestResult] = useState<{ stop: Stop; distanceMeters: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('campusroute_onboarded') !== 'true';
    }
    return true;
  });

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('campusroute_onboarded', 'true');
  };

  // Live transit hook
  const {
    etas,
    activeBuses,
    isRefreshing,
    lastSyncTime,
    formatEta,
    getEtaForStop,
    getNextBusEtaForRoute,
    refreshTransitData,
    findNearestStop,
  } = useLiveTransit();

  // Find nearest stop action with simulated GPS pulse
  const handleFindNearMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      const result = findNearestStop();
      setNearestResult(result);
      setIsLocating(false);
    }, 650);
  };

  // Filtered routes calculation
  const filteredRoutes = useMemo(() => {
    return CAMPUS_ROUTES.filter((route) => {
      const query = searchQuery.trim().toLowerCase();

      // Category filter
      if (selectedCategory === 'major') {
        const hasMajorStop = route.stops.some((s) => s.isMajor);
        if (!hasMajorStop) return false;
      } else if (selectedCategory !== 'all') {
        if (route.category !== selectedCategory) return false;
      }

      // Search query filter (matches route name, code, stop name, or landmark)
      if (!query) return true;

      const matchesName = route.name.toLowerCase().includes(query);
      const matchesCode = route.code.toLowerCase().includes(query);
      const matchesSubtitle = route.subtitle.toLowerCase().includes(query);
      const matchesStop = route.stops.some(
        (stop) =>
          stop.name.toLowerCase().includes(query) ||
          stop.code.toLowerCase().includes(query) ||
          stop.landmarks.some((l) => l.toLowerCase().includes(query))
      );

      return matchesName || matchesCode || matchesSubtitle || matchesStop;
    });
  }, [searchQuery, selectedCategory]);

  // Selected route object
  const selectedRoute = useMemo(() => {
    return CAMPUS_ROUTES.find((r) => r.id === selectedRouteId) || null;
  }, [selectedRouteId]);

  // Selected stop object for modal
  const selectedStop = useMemo(() => {
    if (!selectedStopId) return null;
    return ALL_STOPS[selectedStopId] || null;
  }, [selectedStopId]);

  // Navigation handlers
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRoutes = () => {
    setActiveView('routes');
  };

  const handleOpenStopDetails = (stopId: string) => {
    setSelectedStopId(stopId);
  };

  const handleCloseStopDetails = () => {
    setSelectedStopId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-[#E6EDF3] flex flex-col justify-between transition-colors duration-200">
      <div>
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isRefreshing={isRefreshing}
          onRefresh={refreshTransitData}
          onFindNearMe={handleFindNearMe}
          activeView={activeView}
          onGoHome={() => {
            setActiveView('routes');
            setSearchQuery('');
            setSelectedCategory('all');
          }}
          onOpenStopsDirectory={() => {
            setActiveView(activeView === 'stops-directory' ? 'routes' : 'stops-directory');
          }}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Nearest stop simulation alert banner */}
          {nearestResult && (
            <NearestStopBanner
              stop={nearestResult.stop}
              distanceMeters={nearestResult.distanceMeters}
              onSelectRoute={handleSelectRoute}
              onOpenStopDetails={handleOpenStopDetails}
              onClose={() => setNearestResult(null)}
              getEtaForStop={getEtaForStop}
            />
          )}

          {/* View 1: Main Route Explorer & List */}
          {activeView === 'routes' && (
            <div className="space-y-6">
              {/* Onboarding Tooltip for first-time visitors / demo judges */}
              {showOnboarding && (
                <OnboardingBanner
                  onDismiss={handleDismissOnboarding}
                  onSelectSampleRoute={handleSelectRoute}
                  onSelectSampleStop={handleOpenStopDetails}
                  onFindNearMe={handleFindNearMe}
                />
              )}

              {/* Search, Filter Bar, and Prominent Header */}
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onFindNearMe={handleFindNearMe}
                isLocating={isLocating}
                totalRoutesCount={CAMPUS_ROUTES.length}
                filteredRoutesCount={filteredRoutes.length}
              />

              {/* Route Cards Grid or Loading Skeleton */}
              {isRefreshing ? (
                <RouteListSkeleton />
              ) : filteredRoutes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRoutes.map((route) => {
                    const nextEta = getNextBusEtaForRoute(route);
                    return (
                      <RouteCard
                        key={route.id}
                        route={route}
                        onSelect={handleSelectRoute}
                        nextEta={nextEta}
                        onOpenStopDetails={handleOpenStopDetails}
                      />
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no routes match search */
                <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#0D1117] text-slate-400 dark:text-[#8B949E] flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    No routes found matching "{searchQuery}"
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1 max-w-xs mx-auto">
                    Try searching for "Main Gate", "Library", "Express", or clear your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    Clear Search & Show All Routes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View 2: Route Detail & Metro Stepper Timeline */}
          {activeView === 'detail' && selectedRoute && (
            <RouteDetailView
              route={selectedRoute}
              onBack={handleBackToRoutes}
              getEtaForStop={getEtaForStop}
              activeBuses={activeBuses}
              onOpenStopDetails={handleOpenStopDetails}
              onSwitchRoute={handleSelectRoute}
            />
          )}

          {/* View 3: Stop-First Hub Directory */}
          {activeView === 'stops-directory' && (
            <StopsDirectoryView
              onSelectStop={handleOpenStopDetails}
              onSelectRoute={handleSelectRoute}
              getEtaForStop={getEtaForStop}
            />
          )}
        </main>
      </div>

      {/* Stop Detail Modal (Stop-First View) */}
      {selectedStop && (
        <StopDetailModal
          stop={selectedStop}
          onClose={handleCloseStopDetails}
          onSelectRoute={handleSelectRoute}
          getEtaForStop={getEtaForStop}
        />
      )}

      {/* Footer & Disclaimer Badge */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-[#30363D]/80 bg-white/50 dark:bg-[#161B22]/50 backdrop-blur-xs">
        <DisclaimerBadge />
      </footer>
    </div>
  );
}
