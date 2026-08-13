import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Star, Sparkles } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { getImageUrl, getBackdropUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Rating } from './Rating';

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  rank?: number;
  variant?: 'poster' | 'backdrop';
  onPlayTrailer?: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
}

const FALLBACK_POSTERS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
];

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  mediaType,
  rank,
  variant = 'poster',
  onPlayTrailer,
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isMovie = mediaType === 'movie';
  const title = isMovie ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const releaseYear = (releaseDate || '').slice(0, 4);
  const detailPath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
  const isSaved = isInWatchlist(item.id, mediaType);

  const imageSrc =
    variant === 'backdrop'
      ? getBackdropUrl(item.backdrop_path, 'w780')
      : getImageUrl(item.poster_path, 'w500');

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWatchlist(item.id, mediaType);
    } else {
      addToWatchlist(item, mediaType);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(item, mediaType);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const randomIndex = Math.floor(Math.random() * FALLBACK_POSTERS.length);
    target.src = FALLBACK_POSTERS[randomIndex];
  };

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-cineDark-800 border border-white/10 hover:border-cineRed/50 transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-cineRed/25 hover:-translate-y-1.5">
      {/* Poster / Backdrop Image Container */}
      <Link
        to={detailPath}
        className={`relative w-full overflow-hidden bg-black ${
          variant === 'backdrop' ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
      >
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out"
          onError={handleImageError}
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Rank Number Badge */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-xl bg-gradient-to-br from-cineRed via-red-600 to-cineViolet text-white font-display font-black text-xs flex items-center justify-center shadow-lg shadow-cineRed/40 border border-white/20">
            #{rank}
          </div>
        )}

        {/* Type Badge */}
        {rank === undefined && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-display font-extrabold uppercase px-2 py-0.5 rounded-lg bg-black/60 text-white border border-white/15 backdrop-blur-md">
            {mediaType}
          </span>
        )}

        {/* Play Trailer Hover Button Overlay */}
        <div
          onClick={handlePlayClick}
          className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <div className="p-3.5 rounded-full bg-cineRed text-white shadow-2xl shadow-cineRed/50 transform scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/20">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Quick Watchlist Heart Button */}
        <button
          onClick={handleWatchlistToggle}
          className={`absolute top-2.5 right-2.5 z-30 p-2 rounded-xl transition-all duration-300 focus:outline-none backdrop-blur-md border ${
            isSaved
              ? 'bg-cineRed text-white border-cineRed shadow-lg shadow-cineRed/40 scale-105'
              : 'bg-black/60 text-gray-300 hover:text-white border-white/20 hover:bg-cineRed hover:border-cineRed'
          }`}
          title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </Link>

      {/* Card Info Container */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-cineDark-800 to-cineDark-900">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Rating score={item.vote_average} size="sm" />
            <span className="text-[11px] font-display font-semibold text-gray-400">
              {releaseYear}
            </span>
          </div>

          <Link
            to={detailPath}
            className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-cineRed transition-colors duration-300"
          >
            {title}
          </Link>
        </div>
      </div>
    </div>
  );
};
