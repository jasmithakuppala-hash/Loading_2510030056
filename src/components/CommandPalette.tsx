import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, User, ArrowRight, Sparkles } from 'lucide-react';
import { tmdbService, getImageUrl, getProfileUrl } from '../services/tmdb';
import { Movie, TVShow, Person } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await tmdbService.searchMulti(query, 1);
        setResults((res || []).slice(0, 8)); // Top 8 command results
      } catch (err) {
        console.error('Command search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or parent prop
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (item: Movie | TVShow | Person) => {
    onClose();
    if (item.media_type === 'person' || (!('title' in item) && !('name' in item))) {
      navigate(`/person/${item.id}`);
    } else if (item.media_type === 'tv' || 'first_air_date' in item) {
      navigate(`/tv/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  const handleViewAllResults = () => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in">
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={onClose} />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-cineDark-800 rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
          <Search className="w-5 h-5 text-cineRed flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors, directors... (Ctrl + K)"
            className="w-full bg-transparent text-white placeholder-gray-400 font-sans text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400 border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-white/5 p-2">
          {loading ? (
            <div className="py-8 text-center text-gray-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cineRed animate-spin" />
              <span>Searching Cineverse database...</span>
            </div>
          ) : query && results.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              No results found for "<span className="text-white">{query}</span>"
            </div>
          ) : !query ? (
            <div className="p-6 text-center text-gray-400 text-xs">
              Type to search movies, series, or people globally.
            </div>
          ) : (
            results.map((item) => {
              const isMovie = 'title' in item;
              const isTV = 'name' in item && 'first_air_date' in item;
              const isPerson = !isMovie && !isTV;

              const title = isMovie
                ? (item as Movie).title
                : isTV
                ? (item as TVShow).name
                : (item as Person).name;

              const imageSrc = isPerson
                ? getProfileUrl((item as Person).profile_path)
                : getImageUrl((item as Movie | TVShow).poster_path, 'w185');

              const subText = isMovie
                ? `Movie • ${((item as Movie).release_date || '').slice(0, 4)}`
                : isTV
                ? `TV Show • ${((item as TVShow).first_air_date || '').slice(0, 4)}`
                : `Person • ${ (item as Person).known_for_department || 'Acting' }`;

              return (
                <button
                  key={`${item.id}-${title}`}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 transition-colors text-left group focus:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={imageSrc}
                      alt={title}
                      className="w-10 h-12 object-cover rounded-lg flex-shrink-0 bg-cineDark-900 border border-white/10"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-cineRed transition-colors">
                        {title}
                      </h4>
                      <p className="text-xs text-gray-400 font-sans">{subText}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-white flex-shrink-0">
                    {isMovie && <Film className="w-4 h-4 text-cineBlue" />}
                    {isTV && <Tv className="w-4 h-4 text-cineViolet" />}
                    {isPerson && <User className="w-4 h-4 text-amber-400" />}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer View All */}
        {query && results.length > 0 && (
          <div className="p-3 border-t border-white/10 bg-black/40 text-center">
            <button
              onClick={handleViewAllResults}
              className="text-xs font-display font-bold uppercase tracking-wider text-cineRed hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
            >
              <span>See all results for "{query}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
