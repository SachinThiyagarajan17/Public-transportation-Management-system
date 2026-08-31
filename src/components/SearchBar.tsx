import React from 'react';
import { Search, X, MapPin, Sparkles, Navigation, Layers } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onFindNearMe: () => void;
  isLocating: boolean;
  totalRoutesCount: number;
  filteredRoutesCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onFindNearMe,
  isLocating,
  totalRoutesCount,
  filteredRoutesCount,
}) => {
  const categories = [
    { id: 'all', label: 'All Routes', icon: Layers },
    { id: 'major', label: 'Major Hubs', icon: Sparkles },
    { id: 'Express', label: 'Express', icon: Navigation },
    { id: 'Loop', label: 'Campus Loops', icon: Layers },
    { id: 'Night', label: 'Late Night', icon: Sparkles },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Prominent Header as requested */}
      <div className="text-center max-w-2xl mx-auto pt-2 pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-[#161B22] border border-blue-200 dark:border-[#30363D] text-blue-700 dark:text-[#58A6FF] text-xs font-semibold mb-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
          <span>Real-time Campus Transit Explorer</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-[#F0F6FC] tracking-tight">
          Find Your Campus Bus
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#8B949E] mt-2 font-normal">
          A live bus route & ETA explorer designed to help new students navigate campus effortlessly.
        </p>
      </div>

      {/* Main Search and Location Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-slate-400 dark:text-[#8B949E]" />
          </div>
          <input
            id="input-route-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route, code, or stop (e.g. 'Library', 'Route A', 'Hostel')..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#E6EDF3] placeholder-slate-400 dark:placeholder-[#8B949E] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#388BFD] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Find Stops Near Me CTA button */}
        <button
          id="btn-find-near-me-main"
          onClick={onFindNearMe}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1F6FEB] to-[#238636] hover:from-[#388BFD] hover:to-[#2EA043] text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-98 transition-all disabled:opacity-75 cursor-pointer flex-shrink-0"
        >
          <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce' : ''}`} />
          <span>{isLocating ? 'Locating Stop...' : 'Find Stops Near Me'}</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 max-w-3xl mx-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-chip-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 dark:bg-[#1F6FEB] text-white dark:text-white border border-slate-900 dark:border-[#388BFD] shadow-xs'
                  : 'bg-white dark:bg-[#161B22] text-slate-600 dark:text-[#8B949E] border border-slate-200 dark:border-[#30363D] hover:bg-slate-100 dark:hover:bg-[#21262D] dark:hover:text-[#E6EDF3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-[#0D1117] text-slate-700 dark:text-[#C9D1D9] border border-transparent dark:border-[#30363D]">
                  {totalRoutesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Search / Filter feedback */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8B949E] max-w-3xl mx-auto px-1">
          <span>
            Showing <strong>{filteredRoutesCount}</strong> of {totalRoutesCount} routes
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-blue-600 dark:text-[#58A6FF] hover:underline font-medium cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
