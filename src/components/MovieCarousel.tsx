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
  variant?: 'poster' | 'backdrop';
  showRanks?: boolean;
  viewAllPath?: string;
  onPlayTrailer?: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
  icon?: React.ReactNode;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  subtitle,
  items,
  loading = false,
  mediaType = 'movie',
  variant = 'poster',
  showRanks = false,
  viewAllPath,
  onPlayTrailer,
  icon,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 rounded-xl bg-cineRed/15 text-cineRed">{icon}</div>}
            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-2">
                {title}
              </h3>
              {subtitle && <p className="text-xs sm:text-sm text-gray-400 font-sans mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewAllPath && (
              <Link
                to={viewAllPath}
                className="hidden sm:flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-cineRed hover:text-red-400 transition-colors group"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        {loading ? (
          <CarouselSkeleton count={6} />
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-gray-400 bg-cineDark-800/50 rounded-2xl border border-white/5">
            No content available at the moment.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
          >
            {items.map((item, index) => (
              <MovieCard
                key={`${item.id}-${index}`}
                item={item}
                mediaType={mediaType}
                rank={showRanks ? index + 1 : undefined}
                variant={variant}
                onPlayTrailer={onPlayTrailer}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
