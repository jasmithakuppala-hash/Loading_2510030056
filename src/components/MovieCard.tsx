import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Play, Star } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { getImageUrl, getBackdropUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Rating } from './Rating';

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType?: 'movie' | 'tv';
  rank?: number;
  variant?: 'poster' | 'backdrop';
  onPlayTrailer?: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  mediaType = 'movie',
  rank,
  variant = 'poster',
  onPlayTrailer,
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Determine media type if embedded in item
  const actualMediaType = item.media_type === 'tv' ? 'tv' : (item as TVShow).name ? 'tv' : mediaType;
  const title = (item as Movie).title || (item as TVShow).name || 'Untitled';
  const releaseYear = ((item as Movie).release_date || (item as TVShow).first_air_date || '').slice(0, 4);
  const inWatchlist = isInWatchlist(item.id, actualMediaType);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id, actualMediaType);
    } else {
      addToWatchlist(item, actualMediaType);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    if (onPlayTrailer) {
      e.preventDefault();
      e.stopPropagation();
      onPlayTrailer(item, actualMediaType);
    }
  };

  const detailPath = actualMediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

  if (variant === 'backdrop') {
    return (
      <Link
        to={detailPath}
        className="group relative flex-shrink-0 w-72 sm:w-80 aspect-video rounded-2xl overflow-hidden bg-cineDark-800 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-cineRed/20 hover:-translate-y-1.5 transition-all duration-300 focus:outline-none"
      >
        <img
          src={getBackdropUrl(item.backdrop_path, 'w780')}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Action Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={handleWatchlistClick}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              inWatchlist
                ? 'bg-cineRed border-cineRed text-white shadow-lg shadow-cineRed/40 scale-105'
                : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Center Play Button on Hover */}
        {onPlayTrailer && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handlePlayClick}
              className="w-12 h-12 rounded-full bg-cineRed/90 hover:bg-cineRed text-white flex items-center justify-center shadow-xl shadow-cineRed/40 transform group-hover:scale-110 transition-transform"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>
        )}

        {/* Content Info */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center gap-2 mb-1">
            <Rating score={item.vote_average} size="sm" />
            {releaseYear && <span className="text-[11px] text-gray-300 font-semibold">{releaseYear}</span>}
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/15 text-gray-200">
              {actualMediaType}
            </span>
          </div>
          <h4 className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-cineRed transition-colors">
            {title}
          </h4>
        </div>
      </Link>
    );
  }

  // Standard Poster Variant
  return (
    <Link
      to={detailPath}
      className="group relative flex-shrink-0 w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden bg-cineDark-800 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-cineRed/20 hover:-translate-y-2 transition-all duration-300 focus:outline-none"
    >
      {/* Rank Badge for Trending Carousel */}
      {rank !== undefined && (
        <div className="absolute top-2 left-2 z-20 font-display font-black text-3xl sm:text-4xl text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pointer-events-none select-none">
          #{rank}
        </div>
      )}

      {/* Poster Image */}
      <img
        src={getImageUrl(item.poster_path, 'w500')}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
        }}
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Watchlist Quick Button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={handleWatchlistClick}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
            inWatchlist
              ? 'bg-cineRed border-cineRed text-white shadow-lg shadow-cineRed/40 scale-105'
              : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
          }`}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Play Icon on Hover */}
      {onPlayTrailer && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-cineRed/90 hover:bg-cineRed text-white flex items-center justify-center shadow-xl shadow-cineRed/50 transform group-hover:scale-110 transition-transform"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>
      )}

      {/* Bottom Content Metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 transform group-hover:translate-y-0 transition-transform">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <Rating score={item.vote_average} size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/15 text-gray-200">
            {actualMediaType}
          </span>
        </div>
        <h4 className="font-display font-bold text-sm text-white line-clamp-1 leading-snug group-hover:text-cineRed transition-colors">
          {title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-0.5 font-medium">
          <span>{releaseYear || 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
};
