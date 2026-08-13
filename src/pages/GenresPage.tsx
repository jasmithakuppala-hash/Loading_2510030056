import React, { useState, useEffect } from 'react';
import { Grid, Sparkles, Film, ArrowRight } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { Genre, Movie, VideoTrailer } from '../types';
import { MovieCard } from '../components/MovieCard';
import { CarouselSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/TrailerModal';

const GENRE_CARDS = [
  { id: 28, name: 'ACTION', icon: '⚡', color: 'from-red-600 to-amber-600' },
  { id: 12, name: 'ADVENTURE', icon: '🧭', color: 'from-amber-600 to-emerald-600' },
  { id: 16, name: 'ANIMATION', icon: '🎨', color: 'from-pink-500 to-purple-600' },
  { id: 35, name: 'COMEDY', icon: '😂', color: 'from-yellow-500 to-orange-500' },
  { id: 80, name: 'CRIME', icon: '🔍', color: 'from-slate-700 to-zinc-900' },
  { id: 99, name: 'DOCUMENTARY', icon: '🎥', color: 'from-cyan-600 to-blue-700' },
  { id: 18, name: 'DRAMA', icon: '🎭', color: 'from-purple-600 to-indigo-800' },
  { id: 10751, name: 'FAMILY', icon: '🍿', color: 'from-emerald-500 to-teal-700' },
  { id: 14, name: 'FANTASY', icon: '🔮', color: 'from-violet-600 to-fuchsia-700' },
  { id: 27, name: 'HORROR', icon: '👻', color: 'from-red-900 to-black' },
  { id: 9648, name: 'MYSTERY', icon: '🕵️', color: 'from-indigo-900 to-slate-900' },
  { id: 10749, name: 'ROMANCE', icon: '❤️', color: 'from-pink-600 to-rose-700' },
  { id: 878, name: 'SCI-FI', icon: '🚀', color: 'from-blue-600 to-purple-800' },
  { id: 53, name: 'THRILLER', icon: '💥', color: 'from-orange-700 to-red-900' },
];

export const GenresPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<typeof GENRE_CARDS[0]>(GENRE_CARDS[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      setLoading(true);
      try {
        const results = await tmdbService.discoverContent('movie', {
          with_genres: selectedGenre.id.toString(),
          sort_by: 'popularity.desc',
          page: 1,
        });
        setMovies(results || []);
      } catch (err) {
        console.error('Failed to fetch genre movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreMovies();
  }, [selectedGenre]);

  const handlePlayTrailer = async (item: Movie) => {
    setActiveTrailerTitle(item.title);
    setTrailerModalOpen(true);
    try {
      const trailers = await tmdbService.getMovieTrailers(item.id);
      setActiveTrailers(trailers || []);
    } catch (err) {
      setActiveTrailers([]);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cineViolet/15 text-cineViolet text-xs font-display font-bold uppercase tracking-widest mb-3 border border-cineViolet/30">
          <Grid className="w-3.5 h-3.5" />
          <span>VISUAL DISCOVERY</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
          BROWSE BY <span className="text-cineViolet">GENRE</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-sans mt-2">
          Explore cinematic releases grouped by emotion, narrative theme, and visual style.
        </p>
      </div>

      {/* Genre Visual Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {GENRE_CARDS.map((genre) => {
          const isSelected = selectedGenre.id === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre)}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 focus:outline-none flex flex-col items-center text-center justify-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-cineViolet via-purple-600 to-cineRed border-white text-white shadow-xl shadow-cineViolet/30 scale-105 z-10'
                  : 'bg-cineDark-800/80 hover:bg-cineDark-800 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {genre.icon}
              </span>
              <span className="font-display font-bold text-xs uppercase tracking-wider">
                {genre.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Genre Results Heading */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selectedGenre.icon}</span>
          <div>
            <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
              {selectedGenre.name} MOVIES
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Top rated & trending titles in {selectedGenre.name}
            </p>
          </div>
        </div>

        <span className="text-xs font-display font-bold px-3 py-1.5 rounded-xl bg-cineViolet/20 text-purple-300 border border-cineViolet/30">
          {movies.length} TITLES
        </span>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <CarouselSkeleton count={10} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie, idx) => (
            <MovieCard
              key={`genre-movie-${movie.id}-${idx}`}
              item={movie}
              mediaType="movie"
              onPlayTrailer={() => handlePlayTrailer(movie)}
            />
          ))}
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
