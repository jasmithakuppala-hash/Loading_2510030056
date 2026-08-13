import React, { createContext, useContext, useState, useEffect } from 'react';
import { WatchlistItem, Movie, TVShow } from '../types';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: number, mediaType: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => boolean;
  recentlyViewed: (Movie | TVShow)[];
  addRecentlyViewed: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
  toast: { message: string; type: 'add' | 'remove' } | null;
  clearToast: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'cineverse_watchlist';
const RECENTLY_VIEWED_KEY = 'cineverse_recently_viewed';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<(Movie | TVShow)[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; type: 'add' | 'remove' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('Failed to save recently viewed to localStorage', e);
    }
  }, [recentlyViewed]);

  const showToast = (message: string, type: 'add' | 'remove') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const isInWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some((item) => item.id === id && item.media_type === mediaType);
  };

  const addToWatchlist = (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    if (isInWatchlist(item.id, mediaType)) return;
    
    const title = (item as Movie).title || (item as TVShow).name || 'Untitled';
    const newItem: WatchlistItem = {
      id: item.id,
      title,
      media_type: mediaType,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: (item as Movie).release_date || (item as TVShow).first_air_date,
      addedAt: Date.now(),
    };

    setWatchlist((prev) => [newItem, ...prev]);
    showToast(`Added "${title}" to your Watchlist`, 'add');
  };

  const removeFromWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    const existing = watchlist.find((item) => item.id === id && item.media_type === mediaType);
    if (!existing) return;

    setWatchlist((prev) => prev.filter((item) => !(item.id === id && item.media_type === mediaType)));
    showToast(`Removed "${existing.title}" from your Watchlist`, 'remove');
  };

  const addRecentlyViewed = (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    const itemWithMedia = { ...item, media_type: mediaType };
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => !(i.id === item.id && (i as any).media_type === mediaType));
      return [itemWithMedia, ...filtered].slice(0, 15); // keep latest 15
    });
  };

  const clearToast = () => setToast(null);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        recentlyViewed,
        addRecentlyViewed,
        toast,
        clearToast,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
};
