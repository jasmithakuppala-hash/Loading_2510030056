import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchScoreBadgeProps {
  score?: number; // e.g. 94
  genres?: string[];
  className?: string;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score = 94,
  genres = ['Sci-Fi', 'Thriller', 'Drama'],
  className = '',
}) => {
  const genreListStr = genres.slice(0, 3).join(', ');

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cineRed/20 via-cineViolet/20 to-cineBlue/20 border border-cineViolet/40 backdrop-blur-md ${className}`}
      title={`Because you enjoy ${genreListStr}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-cineViolet animate-pulse" />
      <span className="font-display font-black text-xs text-white tracking-wider">
        {score}% MATCH
      </span>
      <span className="hidden sm:inline text-[10px] text-gray-300 font-sans border-l border-white/15 pl-2">
        Based on your genres
      </span>
    </div>
  );
};
