import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Info, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { getBackdropUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Rating } from './Rating';
import { MatchScoreBadge } from './MatchScoreBadge';

interface HeroProps {
  items: (Movie | TVShow)[];
  loading?: boolean;
  onPlayTrailer?: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
}

export const Hero: React.FC<HeroProps> = ({ items, loading = false, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const featuredItems = items.length > 0 ? items.slice(0, 5) : [];
  const currentItem = featuredItems[currentIndex] || items[0];

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (loading || !currentItem) {
    return (
      <div className="w-full h-[85vh] bg-cineDark-800 animate-pulse relative flex items-center justify-center">
        <div className="text-gray-500 font-display text-sm tracking-widest uppercase">
          LOADING CINEMATIC EXPERIENCES...
        </div>
      </div>
    );
  }

  const isMovie = 'title' in currentItem;
  const title = isMovie ? currentItem.title : currentItem.name;
  const releaseYear = (isMovie ? currentItem.release_date : currentItem.first_air_date || '')?.slice(0, 4);
  const mediaType: 'movie' | 'tv' = isMovie ? 'movie' : 'tv';
  const detailPath = isMovie ? `/movie/${currentItem.id}` : `/tv/${currentItem.id}`;
  const isSaved = isInWatchlist(currentItem.id, mediaType);

  const backdropSrc = getBackdropUrl(currentItem.backdrop_path, 'original');

  return (
    <div className="relative w-full h-[88vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black select-none">
      {/* Dynamic Full-Screen Backdrop Image with Crossfade */}
      {featuredItems.map((item, idx) => {
        const itemBackdrop = getBackdropUrl(item.backdrop_path, 'original');
        const isActive = idx === currentIndex;

        return (
          <div
            key={`hero-bg-${item.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={itemBackdrop}
              alt={title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop';
              }}
            />
          </div>
        );
      })}

      {/* Multi-Layer Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-cineDark-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-cineDark-900 via-cineDark-900/80 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-cineDark-900/90" />

      {/* Ambient Radial Accent Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cineRed/15 blur-3xl rounded-full pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cineRed/30 border border-cineRed/50 text-white font-display font-extrabold text-[10px] uppercase tracking-widest backdrop-blur-md shadow-lg shadow-cineRed/20">
              FEATURED SCREENING
            </span>

            <MatchScoreBadge score={96} genres={['Sci-Fi', 'Adventure', 'Drama']} />

            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {mediaType} • {releaseYear}
            </span>
          </div>

          {/* Large Dramatic Typography Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-none drop-shadow-2xl">
            {title}
          </h1>

          {/* Rating & Tagline */}
          <div className="flex items-center gap-4">
            <Rating score={currentItem.vote_average} size="md" />
            {currentItem.tagline && (
              <p className="text-xs sm:text-sm text-gray-300 italic font-sans border-l-2 border-cineRed pl-3">
                "{currentItem.tagline}"
              </p>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-gray-200 text-sm sm:text-base font-sans line-clamp-3 leading-relaxed max-w-xl drop-shadow">
            {currentItem.overview}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayTrailer && onPlayTrailer(currentItem, mediaType)}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cineRed via-red-600 to-cineRed hover:from-red-600 hover:to-cineRed text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-cineRed/30 hover:shadow-cineRed/50 hover:scale-105 transition-all focus:outline-none"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>WATCH TRAILER</span>
            </button>

            <button
              onClick={() =>
                isSaved
                  ? removeFromWatchlist(currentItem.id, mediaType)
                  : addToWatchlist(currentItem, mediaType)
              }
              className={`px-6 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all focus:outline-none border ${
                isSaved
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-105'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4 text-cineRed" /> : <Plus className="w-4 h-4" />}
              <span>{isSaved ? 'SAVED TO WATCHLIST' : 'ADD TO WATCHLIST'}</span>
            </button>

            <Link
              to={detailPath}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105"
              title="More Details"
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Carousel Slide Indicators */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          {featuredItems.map((_, idx) => (
            <button
              key={`hero-dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-cineRed shadow-lg shadow-cineRed/50' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
