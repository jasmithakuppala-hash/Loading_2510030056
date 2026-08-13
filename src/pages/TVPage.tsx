import React, { useState, useEffect } from 'react';
import { Tv, AlertCircle } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { TVShow, Genre, VideoTrailer } from '../types';
import { MovieCard } from '../components/MovieCard';
import { FilterBar, FilterState } from '../components/FilterBar';
import { CarouselSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/TrailerModal';

export const TVPage: React.FC = () => {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    genreId: '',
    minRating: '',
    year: '',
    sortBy: 'popularity.desc',
  });

  // Trailer Modal State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  useEffect(() => {
    tmdbService.getGenres('tv').then((g) => setGenres(g || []));
  }, []);

  useEffect(() => {
    const fetchTVShows = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          sort_by: filters.sortBy,
        };

        if (filters.genreId) params.with_genres = filters.genreId;
        if (filters.minRating) params['vote_average.gte'] = filters.minRating;
        if (filters.year) {
          if (filters.year.length === 4) {
            params.first_air_date_year = filters.year;
          } else if (filters.year === '2020') {
            params['first_air_date.gte'] = '2020-01-01';
          } else if (filters.year === '2010') {
            params['first_air_date.gte'] = '2010-01-01';
            params['first_air_date.lte'] = '2019-12-31';
          } else if (filters.year === '2000') {
            params['first_air_date.gte'] = '2000-01-01';
            params['first_air_date.lte'] = '2009-12-31';
          } else if (filters.year === '1990') {
            params['first_air_date.gte'] = '1990-01-01';
            params['first_air_date.lte'] = '1999-12-31';
          }
        }

        const results = await tmdbService.discoverContent('tv', params);
        if (page === 1) {
          setTvShows(results || []);
        } else {
          setTvShows((prev) => [...prev, ...(results || [])]);
        }
        setHasMore((results || []).length > 0);
      } catch (err) {
        console.error('Failed to discover TV shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [filters, page]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      genreId: '',
      minRating: '',
      year: '',
      sortBy: 'popularity.desc',
    });
    setPage(1);
  };

  const handlePlayTrailer = async (item: TVShow) => {
    setActiveTrailerTitle(item.name);
    setTrailerModalOpen(true);
    try {
      const trailers = await tmdbService.getTVTrailers(item.id);
      setActiveTrailers(trailers || []);
    } catch (err) {
      console.error('Failed to fetch TV trailers:', err);
      setActiveTrailers([]);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Statement */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cineViolet/15 text-cineViolet text-xs font-display font-bold uppercase tracking-widest mb-3">
          <Tv className="w-3.5 h-3.5" />
          <span>SERIES & TELEVISION</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
          TV <span className="text-cineViolet">SHOWS</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-sans mt-2">
          Explore binge-worthy series, trending TV dramas, and original episodic releases.
        </p>
      </div>

      {/* Discovery Filter Controls */}
      <FilterBar
        filters={filters}
        genres={genres}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* TV Grid */}
      {loading && page === 1 ? (
        <CarouselSkeleton count={10} />
      ) : tvShows.length === 0 ? (
        <div className="py-20 text-center text-gray-400 glass-panel rounded-3xl border border-white/10 p-8">
          <AlertCircle className="w-12 h-12 text-cineViolet mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">No TV Shows Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
            No TV series match your selected filter criteria. Try broadening your filter selections.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-cineViolet text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-cineViolet/30"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {tvShows.map((show, idx) => (
              <MovieCard
                key={`${show.id}-${idx}`}
                item={show}
                mediaType="tv"
                onPlayTrailer={() => handlePlayTrailer(show)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? 'LOADING MORE...' : 'LOAD MORE TV SHOWS'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={activeTrailerTitle}
        trailers={activeTrailers}
      />
    </div>
  );
};
