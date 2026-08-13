import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { MovieCard } from './MovieCard';
import { CarouselSkeleton } from './LoadingSkeleton';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  items: (Movie | TVShow)[];
  loading?: boolean;
  mediaType?: 'movie' | 'tv';
  showRanks?: boolean;
  variant?: 'poster' | 'backdrop';
  viewAllPath?: string;
  icon?: React.ReactNode;
  glowColor?: 'red' | 'blue' | 'gold' | 'purple';
  onPlayTrailer?: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  subtitle,
  items,
  loading = false,
  mediaType,
  showRanks = false,
  variant = 'poster',
  viewAllPath,
  icon,
  glowColor = 'red',
  onPlayTrailer,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -600 : 600;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const glowStyles = {
    red: 'from-cineRed/15 via-cineViolet/10 to-transparent',
    blue: 'from-cineBlue/15 via-cineViolet/10 to-transparent',
    gold: 'from-amber-500/15 via-cineRed/10 to-transparent',
    purple: 'from-cineViolet/15 via-cyan-500/10 to-transparent',
  }[glowColor];

  return (
    <section className="relative py-6 group/section">
      {/* Background Section Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${glowStyles} opacity-60 pointer-events-none transition-opacity duration-500`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight uppercase">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-300 font-sans mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewAllPath && (
              <Link
                to={viewAllPath}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-display font-bold text-cineRed hover:text-red-400 uppercase tracking-wider transition-colors mr-2"
              >
                <span>EXPLORE ALL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all focus:outline-none disabled:opacity-30"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all focus:outline-none disabled:opacity-30"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        {loading ? (
          <CarouselSkeleton count={6} />
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 -mx-1"
          >
            {items.map((item, index) => {
              const itemMediaType =
                mediaType ||
                (item.media_type as 'movie' | 'tv') ||
                ((item as Movie).title ? 'movie' : 'tv');

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={
                    variant === 'backdrop'
                      ? 'flex-none w-64 sm:w-80'
                      : 'flex-none w-36 sm:w-48 lg:w-52'
                  }
                >
                  <MovieCard
                    item={item}
                    mediaType={itemMediaType}
                    rank={showRanks ? index + 1 : undefined}
                    variant={variant}
                    onPlayTrailer={onPlayTrailer}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
