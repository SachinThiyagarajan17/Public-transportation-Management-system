export interface Stop {
  id: string;
  name: string;
  code: string;
  isMajor: boolean;
  description: string;
  landmarks: string[];
  baseMinutes: number; // initial ETA in minutes
  accessible: boolean;
  // Simulated campus coordinates for "nearest stop" calculations
  coords: {
    x: number; // percentage in campus grid 0-100
    y: number;
  };
}

export interface Route {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  category: 'Loop' | 'Express' | 'Shuttle' | 'Night';
  colorName: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  stops: Stop[];
  frequency: string;
  operatingHours: string;
  status: 'On Time' | 'High Demand' | 'Departing Soon' | 'Express Service';
  activeBuses: number;
  crowdLevel: 'Low' | 'Moderate' | 'Busy';
  totalDuration: string;
  description: string;
}

export interface StopWithRouteInfo {
  stop: Stop;
  routes: {
    route: Route;
    etaMinutes: number;
    etaSeconds: number;
    isNextBus: boolean;
  }[];
}

export interface ActiveBusLocation {
  routeId: string;
  busNumber: string;
  currentStopIndex: number;
  progressToNextStop: number; // 0 to 1
  nextStopName: string;
  occupancy: 'Light' | 'Half Full' | 'Full';
}
