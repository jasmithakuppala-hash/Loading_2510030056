import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black/90 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-cineRed/10 via-cineViolet/10 to-cineBlue/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Large Statement Heading */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase max-w-3xl leading-none">
            DISCOVER SOMETHING <span className="bg-clip-text text-transparent bg-gradient-to-r from-cineRed via-red-500 to-cineViolet">WORTH WATCHING.</span>
          </h2>
          <p className="text-gray-400 mt-3 font-sans text-sm sm:text-base max-w-xl">
            Cineverse is a modern cinematic movie & TV show discovery platform powered by TMDB data. Explore trending titles, personalized moods, trailers, and save your favorites.
          </p>
        </div>

        {/* Grid Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/10">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">NAVIGATION</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/" className="text-gray-300 hover:text-cineRed transition-colors">Home</Link></li>
              <li><Link to="/movies" className="text-gray-300 hover:text-cineRed transition-colors">Movies</Link></li>
              <li><Link to="/tv" className="text-gray-300 hover:text-cineRed transition-colors">TV Series</Link></li>
              <li><Link to="/people" className="text-gray-300 hover:text-cineRed transition-colors">Popular People</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">DISCOVERY</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/genres" className="text-gray-300 hover:text-cineViolet transition-colors">Browse Genres</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-cineViolet transition-colors">Global Search</Link></li>
              <li><Link to="/watchlist" className="text-gray-300 hover:text-cineViolet transition-colors">My Watchlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">FEATURES</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li className="text-gray-400">Mood Discovery</li>
              <li className="text-gray-400">Cineverse Match Score</li>
              <li className="text-gray-400">Curated Collections</li>
              <li className="text-gray-400">HD Trailer Preview</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">BRAND & API</h3>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-5 h-5 text-cineRed" />
              <span className="font-display font-bold text-white text-lg tracking-wider">CINEVERSE</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cineRed hover:underline font-semibold"
            >
              Learn about TMDB <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CINEVERSE. Crafted with precision for Deploython 2.0.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-cineRed fill-cineRed inline mx-0.5" />
            <span>using React, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
