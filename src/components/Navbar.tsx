import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Tv, Users, Grid, Bookmark, Search, Sun, Moon, Menu, X, Sparkles, Command } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenCommandSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/', icon: Sparkles },
    { name: 'MOVIES', path: '/movies', icon: Film },
    { name: 'TV SHOWS', path: '/tv', icon: Tv },
    { name: 'PEOPLE', path: '/people', icon: Users },
    { name: 'GENRES', path: '/genres', icon: Grid },
    { name: 'WATCHLIST', path: '/watchlist', icon: Bookmark, badge: watchlist.length },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cineRed via-red-600 to-cineViolet flex items-center justify-center shadow-lg shadow-cineRed/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-wider text-white flex items-center gap-1">
              CINE<span className="text-cineRed group-hover:text-cineViolet transition-colors">VERSE</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold -mt-1">
              Discover & Save
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-2 rounded-lg font-display text-xs tracking-wider font-semibold transition-all flex items-center gap-2 ${
                  active
                    ? 'text-white bg-white/10 shadow-inner border border-white/15'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-cineRed' : 'text-gray-400'}`} />
                <span>{link.name}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-1 bg-cineRed text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {link.badge}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-cineRed to-cineViolet rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions (Search Trigger, Theme Toggle, Mobile Menu) */}
        <div className="flex items-center gap-3">
          {/* Quick Command / Global Search Trigger */}
          <button
            onClick={() => {
              if (onOpenCommandSearch) {
                onOpenCommandSearch();
              } else {
                navigate('/search');
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all group focus:outline-none"
            title="Global Search (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-cineRed group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-sans text-xs text-gray-400 font-medium">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-gray-400 border border-white/10">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cineViolet hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-display text-sm font-semibold transition-all ${
                  active ? 'bg-cineRed text-white shadow-lg shadow-cineRed/30' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="bg-white text-cineRed text-xs font-black px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
