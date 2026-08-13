import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showMax?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({ score, size = 'sm', showMax = false, className = '' }) => {
  const formattedScore = (score || 0).toFixed(1);

  const sizeClasses = {
    sm: 'text-xs gap-1 py-0.5 px-2',
    md: 'text-sm gap-1.5 py-1 px-2.5',
    lg: 'text-base gap-2 py-1.5 px-3',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center font-display font-bold rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 ${sizeClasses[size]} ${className}`}
    >
      <Star className={`${iconSizes[size]} fill-amber-400 text-amber-400`} />
      <span>{formattedScore}</span>
      {showMax && <span className="text-gray-400 font-normal text-[0.8em]">/ 10</span>}
    </div>
  );
};
