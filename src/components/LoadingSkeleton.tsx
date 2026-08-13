import React from 'react';

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[85vh] bg-cineDark-800 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-transparent to-transparent" />
      <div className="absolute bottom-16 left-6 sm:left-12 max-w-2xl space-y-4">
        <div className="w-24 h-6 rounded-full bg-white/10" />
        <div className="w-3/4 h-14 rounded-2xl bg-white/10" />
        <div className="w-full h-16 rounded-xl bg-white/10" />
        <div className="flex gap-4 pt-4">
          <div className="w-36 h-12 rounded-xl bg-cineRed/30" />
          <div className="w-36 h-12 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ aspect?: 'poster' | 'backdrop' }> = ({ aspect = 'poster' }) => {
  return (
    <div
      className={`relative rounded-2xl bg-cineDark-800 border border-white/5 animate-pulse overflow-hidden ${
        aspect === 'poster' ? 'aspect-[2/3] w-44 sm:w-52' : 'aspect-video w-72 sm:w-80'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="w-3/4 h-4 rounded bg-white/20" />
        <div className="w-1/2 h-3 rounded bg-white/10" />
      </div>
    </div>
  );
};

export const CarouselSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="flex gap-4 overflow-hidden py-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
