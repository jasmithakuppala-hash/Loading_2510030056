import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Bookmark, Info, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { getBackdropUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { HeroSkeleton } from './LoadingSkeleton';
import { Rating } from './Rating';

interface HeroProps {
  items: (Movie | TVShow)[];
  loading?: boolean;
  onPlayTrailer: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
}

export const Hero: React.FC<HeroProps> = ({ items, loading = false, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Featured items subset (top 5)
  const featured = items.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000); // 8 second rotation
    return () => clearInterval(interval);
  }, [featured.length]);

  if (loading || featured.length === 0) {
    return <HeroSkeleton />;
  }

  const currentItem = featured[currentIndex] || featured[0];
  const title = (currentItem as Movie).title || (currentItem as TVShow).name || 'Featured Release';
  const releaseYear = ((currentItem as Movie).release_date || (currentItem as TVShow).first_air_date || '').slice(0, 4);
  const mediaType = (currentItem as TVShow).name ? 'tv' : 'movie';
  const inWatchlist = isInWatchlist(currentItem.id, mediaType);
  const detailPath = mediaType === 'tv' ? `/tv/${currentItem.id}` : `/movie/${currentItem.id}`;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % featured.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);

  return (
    <div className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-end bg-black overflow-hidden select-none">
      {/* Dynamic TMDB Backdrop Background with Smooth Transition */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentItem.id}
          src={getBackdropUrl(currentItem.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-center animate-fade-in transition-transform duration-1000 scale-105"
        />
        {/* Layered Cinematic Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-cineDark-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cineDark-900 via-cineDark-900/80 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-black/30 backdrop-contrast-125" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 pt-32">
        <div className="max-w-2xl space-y-5">
          {/* Featured Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cineRed/20 border border-cineRed/40 text-cineRed text-xs font-display font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEATURED SELECTION</span>
          </div>

          {/* Title with Editorial Display Font */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] uppercase drop-shadow-2xl">
            {title}
          </h1>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Rating score={currentItem.vote_average} size="md" showMax />
            {releaseYear && (
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-gray-200 border border-white/10 text-xs">
                {releaseYear}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md bg-cineViolet/20 text-purple-300 border border-cineViolet/30 text-xs uppercase font-bold">
              {mediaType === 'tv' ? 'TV SERIES' : 'FEATURE FILM'}
            </span>
          </div>

          {/* Overview Synopsis */}
          <p className="text-gray-300 font-sans text-sm sm:text-base line-clamp-3 leading-relaxed max-w-xl text-shadow">
            {currentItem.overview || 'No description available for this title.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* WATCH TRAILER CTA */}
            <button
              onClick={() => onPlayTrailer(currentItem, mediaType)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cineRed via-red-600 to-cineRed text-white font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-xl shadow-cineRed/30 hover:shadow-cineRed/50 hover:scale-105 transition-all focus:outline-none"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
              <span>WATCH TRAILER</span>
            </button>

            {/* ADD TO WATCHLIST */}
            <button
              onClick={() => {
                if (inWatchlist) {
                  removeFromWatchlist(currentItem.id, mediaType);
                } else {
                  addToWatchlist(currentItem, mediaType);
                }
              }}
              className={`px-6 py-3.5 rounded-2xl font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2 border transition-all focus:outline-none ${
                inWatchlist
                  ? 'bg-white/15 border-cineRed text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border-white/20 text-gray-200 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-cineRed text-cineRed' : ''}`} />
              <span>{inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
            </button>

            {/* EXPLORE DETAILS */}
            <Link
              to={detailPath}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>DETAILS</span>
            </Link>
          </div>
        </div>

        {/* Rotation Dots & Previous / Next Controls */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-cineRed' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors focus:outline-none"
              aria-label="Previous featured movie"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors focus:outline-none"
              aria-label="Next featured movie"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
