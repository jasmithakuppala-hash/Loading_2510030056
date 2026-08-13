import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Film, Tv, Sparkles, Trash2, ArrowRight, Clock, Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/tmdb';
import { Rating } from '../components/Rating';
import { MovieCarousel } from '../components/MovieCarousel';

type TabType = 'all' | 'movie' | 'tv';

export const WatchlistPage: React.FC = () => {
  const { watchlist, removeFromWatchlist, recentlyViewed } = useWatchlist();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredItems = watchlist.filter((item) => {
    if (activeTab === 'movie') return item.media_type === 'movie';
    if (activeTab === 'tv') return item.media_type === 'tv';
    return true;
  });

  const counts = {
    all: watchlist.length,
    movie: watchlist.filter((i) => i.media_type === 'movie').length,
    tv: watchlist.filter((i) => i.media_type === 'tv').length,
  };

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cineRed/15 text-cineRed text-xs font-display font-bold uppercase tracking-widest mb-3">
            <Bookmark className="w-3.5 h-3.5 fill-cineRed" />
            <span>PERSONAL COLLECTION</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            MY <span className="text-cineRed">WATCHLIST</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-sans mt-2">
            Your saved movies and series ready to stream anytime.
          </p>
        </div>

        {/* Saved Count Badge */}
        {watchlist.length > 0 && (
          <div className="glass-panel px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3 self-start md:self-auto">
            <Heart className="w-5 h-5 text-cineRed fill-cineRed animate-pulse" />
            <div>
              <div className="font-display font-black text-xl text-white leading-none">
                {watchlist.length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                SAVED TITLES
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      {watchlist.length > 0 && (
        <div className="flex items-center gap-2 pb-4 mb-8 border-b border-white/10">
          {[
            { id: 'all', label: 'ALL SAVED', icon: Sparkles, count: counts.all },
            { id: 'movie', label: 'MOVIES', icon: Film, count: counts.movie },
            { id: 'tv', label: 'TV SHOWS', icon: Tv, count: counts.tv },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
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

      {/* Watchlist Grid */}
      {watchlist.length === 0 ? (
        /* Cinematic Empty State */
        <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 p-8 sm:p-12 max-w-2xl mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-cineRed/10 border border-cineRed/30 text-cineRed flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cineRed/20">
            <Bookmark className="w-10 h-10" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-3">
            YOUR WATCHLIST IS EMPTY.
          </h2>
          <p className="text-gray-300 font-sans text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            "Your next favorite is still waiting." Explore thousands of movies, TV shows, and trending titles.
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cineRed via-red-600 to-cineRed text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-cineRed/30 hover:shadow-cineRed/50 hover:scale-105 transition-all"
          >
            <span>DISCOVER MOVIES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-gray-400 glass-panel rounded-3xl border border-white/10 p-8">
          <p className="text-base text-gray-300 mb-4">
            No items in your watchlist match the selected {activeTab.toUpperCase()} filter.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-display font-bold uppercase"
          >
            View All Saved
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const detailPath = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
            const releaseYear = (item.release_date || '').slice(0, 4);

            return (
              <div
                key={`${item.media_type}-${item.id}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-cineDark-800 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-cineRed/20 transition-all duration-300"
              >
                <Link to={detailPath} className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                  <img
                    src={getImageUrl(item.poster_path, 'w500')}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-md">
                    {item.media_type}
                  </span>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWatchlist(item.id, item.media_type)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-cineRed border border-white/20 text-gray-300 hover:text-white transition-all shadow-lg focus:outline-none z-10"
                  title="Remove from Watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Info Container */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Rating score={item.vote_average} size="sm" />
                      <span className="text-[11px] text-gray-400 font-medium">{releaseYear}</span>
                    </div>
                    <Link
                      to={detailPath}
                      className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-cineRed transition-colors"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recently Viewed History Shelf */}
      {recentlyViewed.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/10">
          <MovieCarousel
            title="RECENTLY VIEWED"
            subtitle="Titles you recently opened on Cineverse"
            items={recentlyViewed}
            variant="backdrop"
            icon={<Clock className="w-5 h-5 text-cineViolet" />}
          />
        </div>
      )}
    </div>
  );
};
