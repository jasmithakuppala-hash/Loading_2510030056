import React, { useEffect } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';
import { VideoTrailer } from '../types';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailers: VideoTrailer[];
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, title, trailers }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Find official trailer or teaser
  const activeTrailer =
    trailers.find((t) => t.type === 'Trailer' && t.site === 'YouTube' && t.official) ||
    trailers.find((t) => t.type === 'Trailer' && t.site === 'YouTube') ||
    trailers.find((t) => t.site === 'YouTube') ||
    trailers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-cineDark-800 rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cineRed/20 text-cineRed flex items-center justify-center">
              <Play className="w-4 h-4 fill-cineRed" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{title}</h3>
              <p className="text-xs text-gray-400 font-sans">
                {activeTrailer ? `${activeTrailer.type} — ${activeTrailer.name}` : 'Official Preview'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {activeTrailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 max-w-md">
              <AlertCircle className="w-12 h-12 text-cineRed mx-auto mb-3 animate-pulse" />
              <h4 className="font-display font-bold text-xl text-white mb-2">No Trailer Available</h4>
              <p className="text-gray-400 text-sm">
                TMDB has not provided an official trailer preview for this title yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
