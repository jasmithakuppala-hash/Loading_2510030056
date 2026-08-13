import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Film, Tv, Grid, Bookmark, Search } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const MobileBottomNav: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const location = useLocation();
  const { watchlist } = useWatchlist();

  const links = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'TV', path: '/tv', icon: Tv },
    { name: 'Genres', path: '/genres', icon: Grid },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark, badge: watchlist.length },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(link.path);

        return (
          <Link
            key={link.name}
            to={link.path}
            className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              isActive ? 'text-cineRed font-bold scale-105' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {link.badge !== undefined && link.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-cineRed text-white text-[9px] font-extrabold px-1 rounded-full">
                  {link.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-display uppercase tracking-wider mt-1">
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
