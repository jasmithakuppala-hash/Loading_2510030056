import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, Tv, User, Sparkles, FilterX } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { Movie, TVShow, Person, VideoTrailer } from '../types';
import { MovieCard } from '../components/MovieCard';
import { PersonCard } from '../components/PersonCard';
import { CarouselSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/TrailerModal';

type TabType = 'all' | 'movie' | 'tv' | 'person';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [loading, setLoading] = useState(false);

  // Trailer Modal State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await tmdbService.searchMulti(query, 1);
        setResults(res || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handlePlayTrailer = async (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    const title = (item as Movie).title || (item as TVShow).name || 'Trailer';
    setActiveTrailerTitle(title);
    setTrailerModalOpen(true);

    try {
      const trailers =
        mediaType === 'tv'
          ? await tmdbService.getTVTrailers(item.id)
          : await tmdbService.getMovieTrailers(item.id);
      setActiveTrailers(trailers || []);
    } catch (error) {
      console.error('Failed to fetch trailers:', error);
      setActiveTrailers([]);
    }
  };

  // Filter results based on active tab
  const filteredResults = results.filter((item) => {
    const isMovie = 'title' in item;
    const isTV = 'name' in item && 'first_air_date' in item;
    const isPerson = !isMovie && !isTV;

    if (activeTab === 'movie') return isMovie;
    if (activeTab === 'tv') return isTV;
    if (activeTab === 'person') return isPerson;
    return true; // 'all'
  });

  const counts = {
    all: results.length,
    movie: results.filter((i) => 'title' in i).length,
    tv: results.filter((i) => 'name' in i && 'first_air_date' in i).length,
    person: results.filter((i) => !('title' in i) && !('first_air_date' in i)).length,
  };

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header & Big Search Input */}
      <div className="mb-8 max-w-3xl">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mb-3">
          GLOBAL <span className="text-cineRed">SEARCH</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-sans mb-6">
          Find movies, TV series, actors, and directors across the Cineverse universe.
        </p>

        {/* Large Input Box */}
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-5 w-6 h-6 text-cineRed" />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Type movie name, TV series title, or actor name..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-cineDark-800 border border-white/15 text-white font-sans text-base sm:text-lg focus:outline-none focus:border-cineRed focus:ring-2 focus:ring-cineRed/30 shadow-2xl transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Tabs Row */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-white/10">
          {[
            { id: 'all', label: 'ALL RESULTS', icon: Sparkles, count: counts.all },
            { id: 'movie', label: 'MOVIES', icon: Film, count: counts.movie },
            { id: 'tv', label: 'TV SHOWS', icon: Tv, count: counts.tv },
            { id: 'person', label: 'PEOPLE', icon: User, count: counts.person },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all focus:outline-none flex-shrink-0 ${
                  active
                    ? 'bg-cineRed text-white shadow-lg shadow-cineRed/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white text-cineRed' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <CarouselSkeleton count={8} />
      ) : !query.trim() ? (
        <div className="py-20 text-center text-gray-400 glass-panel rounded-3xl border border-white/10 p-8">
          <SearchIcon className="w-12 h-12 text-cineRed/60 mx-auto mb-4 animate-bounce" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">Search Cineverse</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Start typing above to search for movies like "Interstellar", series like "Stranger Things", or actors like "Christopher Nolan".
          </p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="py-20 text-center text-gray-400 glass-panel rounded-3xl border border-white/10 p-8">
          <FilterX className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">No Matching Results</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            We couldn't find any results matching "{query}" in the {activeTab.toUpperCase()} category. Try refining your keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredResults.map((item, idx) => {
            const isMovie = 'title' in item;
            const isTV = 'name' in item && 'first_air_date' in item;

            if (isMovie) {
              return (
                <MovieCard
                  key={`movie-${item.id}-${idx}`}
                  item={item as Movie}
                  mediaType="movie"
                  onPlayTrailer={handlePlayTrailer}
                />
              );
            } else if (isTV) {
              return (
                <MovieCard
                  key={`tv-${item.id}-${idx}`}
                  item={item as TVShow}
                  mediaType="tv"
                  onPlayTrailer={handlePlayTrailer}
                />
              );
            } else {
              return <PersonCard key={`person-${item.id}-${idx}`} person={item as Person} />;
            }
          })}
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
