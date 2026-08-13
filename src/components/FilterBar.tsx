import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Star, Calendar, Grid } from 'lucide-react';
import { Genre } from '../types';

export interface FilterState {
  genreId: string;
  minRating: string;
  year: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  genres: Genre[];
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, genres, onChange, onReset }) => {
  const handleSelect = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.genreId !== '' || filters.minRating !== '' || filters.year !== '' || filters.sortBy !== 'popularity.desc';

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-display font-bold text-sm tracking-wider uppercase">
          <SlidersHorizontal className="w-4 h-4 text-cineRed" />
          <span>DISCOVERY FILTERS</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-cineRed hover:text-red-400 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Select Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Genre Selector */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
            <Grid className="w-3 h-3 text-cineViolet" /> Genre
          </label>
          <select
            value={filters.genreId}
            onChange={(e) => handleSelect('genreId', e.target.value)}
            className="w-full bg-cineDark-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-cineRed transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Rating Selector */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Min Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleSelect('minRating', e.target.value)}
            className="w-full bg-cineDark-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-cineRed transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Ratings</option>
            <option value="8">★ 8.0+ Exceptional</option>
            <option value="7">★ 7.0+ Highly Rated</option>
            <option value="6">★ 6.0+ Good</option>
            <option value="5">★ 5.0+ Average</option>
          </select>
        </div>

        {/* Year / Release Date Selector */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cineBlue" /> Release Era
          </label>
          <select
            value={filters.year}
            onChange={(e) => handleSelect('year', e.target.value)}
            className="w-full bg-cineDark-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-cineRed transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2020">2020s Era</option>
            <option value="2010">2010s Era</option>
            <option value="2000">2000s Era</option>
            <option value="1990">90s Classics</option>
          </select>
        </div>

        {/* Sort By Selector */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cineRed" /> Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSelect('sortBy', e.target.value)}
            className="w-full bg-cineDark-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-cineRed transition-colors appearance-none cursor-pointer"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest Release</option>
            <option value="primary_release_date.asc">Oldest Release</option>
          </select>
        </div>
      </div>
    </div>
  );
};
