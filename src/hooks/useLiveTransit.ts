import { useState, useEffect, useCallback } from 'react';
import { CAMPUS_ROUTES, ALL_STOPS } from '../data/campusRoutes';
import { Stop, Route, ActiveBusLocation } from '../types';

export interface RouteEtaState {
  // Key format: `${routeId}_${stopId}` -> seconds remaining
  [key: string]: number;
}

export function useLiveTransit() {
  // Store countdowns in seconds for all route-stop pairs
  const [etas, setEtas] = useState<RouteEtaState>(() => {
    const initial: RouteEtaState = {};
    CAMPUS_ROUTES.forEach((route) => {
      route.stops.forEach((stop, index) => {
        // Initial simulated offset based on stop index and route frequency
        const initialSec = (stop.baseMinutes * 60) + (index * 45);
        initial[`${route.id}_${stop.id}`] = initialSec;
      });
    });
    return initial;
  });

  // Simulated live buses tracking
  const [activeBuses, setActiveBuses] = useState<ActiveBusLocation[]>([
    {
      routeId: 'route-north-loop',
      busNumber: 'Bus #101',
      currentStopIndex: 1,
      progressToNextStop: 0.45,
      nextStopName: 'Central Library Circle',
      occupancy: 'Moderate',
    },
    {
      routeId: 'route-sci-tech',
      busNumber: 'Bus #204',
      currentStopIndex: 0,
      progressToNextStop: 0.8,
      nextStopName: 'AI & Robotics Institute',
      occupancy: 'Busy',
    },
    {
      routeId: 'route-residential',
      busNumber: 'Bus #312',
      currentStopIndex: 2,
      progressToNextStop: 0.25,
      nextStopName: 'Student Union Hub',
      occupancy: 'Full',
    },
    {
      routeId: 'route-arts-center',
      busNumber: 'Bus #408',
      currentStopIndex: 0,
      progressToNextStop: 0.6,
      nextStopName: 'School of Design & Architecture',
      occupancy: 'Light',
    },
    {
      routeId: 'route-night-owl',
      busNumber: 'Bus #505',
      currentStopIndex: 1,
      progressToNextStop: 0.35,
      nextStopName: '24/7 Study Pavilion',
      occupancy: 'Moderate',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Countdown timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setEtas((prev) => {
        const next: RouteEtaState = { ...prev };
        let updated = false;

        Object.keys(next).forEach((key) => {
          const currentVal = next[key];
          if (currentVal > 0) {
            next[key] = currentVal - 1;
            updated = true;
          } else {
            // Bus arrived! Reset with next bus in ~8 to 14 minutes
            const randomReset = Math.floor(Math.random() * 360) + 480; // 8-14 min in seconds
            next[key] = randomReset;
            updated = true;
          }
        });

        return updated ? next : prev;
      });

      // Slowly increment bus progress for visual movement
      setActiveBuses((prevBuses) =>
        prevBuses.map((bus) => {
          let newProgress = bus.progressToNextStop + 0.015;
          let newIndex = bus.currentStopIndex;
          const route = CAMPUS_ROUTES.find((r) => r.id === bus.routeId);
          if (!route) return bus;

          if (newProgress >= 1) {
            newProgress = 0;
            newIndex = (newIndex + 1) % route.stops.length;
          }

          const nextStop = route.stops[(newIndex + 1) % route.stops.length];

          return {
            ...bus,
            currentStopIndex: newIndex,
            progressToNextStop: newProgress,
            nextStopName: nextStop?.name || 'Terminal',
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds to human friendly "4 min" or "Arriving now" or "35 sec"
  const formatEta = useCallback((seconds: number | undefined): { text: string; isImminent: boolean; isBoarding: boolean } => {
    if (seconds === undefined) return { text: 'Loading...', isImminent: false, isBoarding: false };
    
    if (seconds <= 20) {
      return { text: 'Arriving now', isImminent: true, isBoarding: true };
    }
    if (seconds < 60) {
      return { text: `${seconds} sec`, isImminent: true, isBoarding: false };
    }
    
    const minutes = Math.ceil(seconds / 60);
    return { 
      text: `${minutes} min`, 
      isImminent: minutes <= 3, 
      isBoarding: false 
    };
  }, []);

  // Helper to get ETA for specific route and stop
  const getEtaForStop = useCallback((routeId: string, stopId: string) => {
    const key = `${routeId}_${stopId}`;
    const seconds = etas[key] ?? 300;
    return {
      seconds,
      ...formatEta(seconds),
    };
  }, [etas, formatEta]);

  // Helper to get lowest ETA for a route (the nearest approaching bus)
  const getNextBusEtaForRoute = useCallback((route: Route) => {
    let minSeconds = Infinity;
    route.stops.forEach((stop) => {
      const key = `${route.id}_${stop.id}`;
      const sec = etas[key];
      if (sec !== undefined && sec < minSeconds) {
        minSeconds = sec;
      }
    });

    if (minSeconds === Infinity) minSeconds = 240;
    return formatEta(minSeconds);
  }, [etas, formatEta]);

  // Manual refresh trigger with simulated sync animation
  const refreshTransitData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncTime(new Date());
      setIsRefreshing(false);
    }, 600);
  }, []);

  // Simulated "Find nearest stop" algorithm
  const findNearestStop = useCallback((): { stop: Stop; distanceMeters: number } => {
    const stopsList = Object.values(ALL_STOPS);
    // Pick from high-traffic popular campus hubs for exciting demo experience
    const popularStopIds = [
      'stop-student-union',
      'stop-library-circle',
      'stop-main-gate',
      'stop-central-transit-hub',
      'stop-west-dormitories',
    ];
    const chosenId = popularStopIds[Math.floor(Math.random() * popularStopIds.length)];
    const stop = ALL_STOPS[chosenId] || stopsList[0];
    const distanceMeters = Math.floor(Math.random() * 120) + 45; // 45m - 165m (1-2 min walk)

    return { stop, distanceMeters };
  }, []);

  return {
    etas,
    activeBuses,
    isRefreshing,
    lastSyncTime,
    formatEta,
    getEtaForStop,
    getNextBusEtaForRoute,
    refreshTransitData,
    findNearestStop,
  };
}
