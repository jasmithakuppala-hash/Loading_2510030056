import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';
import { MOOD_OPTIONS, useMood } from '../context/MoodContext';
import { MoodType, Movie, TVShow, VideoTrailer } from '../types';
import { tmdbService } from '../services/tmdb';
import { MovieCard } from './MovieCard';
import { CarouselSkeleton } from './LoadingSkeleton';
import { TrailerModal } from './TrailerModal';

const MOOD_COLOR_CLASSES: Record<string, { active: string; border: string; glow: string }> = {
  adrenaline: {
    active: 'bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 text-white',
    border: 'border-red-500/40 hover:border-red-500',
    glow: 'shadow-red-600/30',
  },
  mindbending: {
    active: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-cineViolet text-white',
    border: 'border-blue-500/40 hover:border-blue-500',
    glow: 'shadow-blue-600/30',
  },
  romance: {
    active: 'bg-gradient-to-br from-pink-600 via-rose-600 to-cineRed text-white',
    border: 'border-pink-500/40 hover:border-pink-500',
    glow: 'shadow-pink-600/30',
  },
  feelgood: {
    active: 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white',
    border: 'border-amber-500/40 hover:border-amber-500',
    glow: 'shadow-amber-500/30',
  },
  dark: {
    active: 'bg-gradient-to-br from-purple-900 via-zinc-900 to-black text-white',
    border: 'border-purple-600/40 hover:border-purple-600',
    glow: 'shadow-purple-900/40',
  },
  scifi: {
    active: 'bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white',
    border: 'border-cyan-500/40 hover:border-cyan-500',
    glow: 'shadow-cyan-600/30',
  },
  emotional: {
    active: 'bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white',
    border: 'border-indigo-500/40 hover:border-indigo-500',
    glow: 'shadow-indigo-600/30',
  },
  drama: {
    active: 'bg-gradient-to-br from-purple-700 via-indigo-800 to-cineRed text-white',
    border: 'border-purple-500/40 hover:border-purple-500',
    glow: 'shadow-purple-600/30',
  },
};

export const MoodDiscovery: React.FC = () => {
  const { activeMood, selectMood, getActiveMoodOption } = useMood();
  const [moodResults, setMoodResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);

  // Trailer Modal State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  const activeOption = getActiveMoodOption();

  useEffect(() => {
    if (!activeOption) {
      setMoodResults([]);
      return;
    }

    const fetchMoodContent = async () => {
      setLoading(true);
      try {
        const genreStr = activeOption.genreIds.join(',');
        const results = await tmdbService.discoverContent('movie', {
          with_genres: genreStr,
          sort_by: 'popularity.desc',
          page: 1,
        });
        setMoodResults(results || []);
      } catch (err) {
        console.error('Failed to fetch mood content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodContent();
  }, [activeMood]);

  const handlePlayTrailer = async (item: Movie | TVShow) => {
    const title = (item as Movie).title || (item as TVShow).name || 'Trailer';
    setActiveTrailerTitle(title);
    setTrailerModalOpen(true);
    try {
      const trailers = await tmdbService.getMovieTrailers(item.id);
      setActiveTrailers(trailers || []);
    } catch (err) {
      setActiveTrailers([]);
    }
  };

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Dynamic Ambient Section Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-cineRed/15 via-cineViolet/15 to-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cineRed/20 via-cineViolet/20 to-cyan-500/20 text-white text-xs font-display font-bold uppercase tracking-widest mb-3 border border-white/15">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>CINEMATIC PERSONALIZATION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            WHAT ARE YOU IN THE <span className="bg-clip-text text-transparent bg-gradient-to-r from-cineRed via-cineViolet to-cyan-400">MOOD FOR?</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-sans mt-2">
            Select an emotion to dynamically filter titles tailored to your visual mood.
          </p>
        </div>

        {/* 8 Custom Stylized Mood Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {MOOD_OPTIONS.map((mood) => {
            const isActive = activeMood === mood.id;
            const styleConfig = MOOD_COLOR_CLASSES[mood.id] || MOOD_COLOR_CLASSES.adrenaline;

            return (
              <button
                key={mood.id}
                onClick={() => selectMood(mood.id)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none flex flex-col justify-between h-32 ${
                  isActive
                    ? `${styleConfig.active} border-white shadow-2xl ${styleConfig.glow} scale-105 z-10`
                    : `bg-cineDark-800/90 ${styleConfig.border} text-gray-200 hover:text-white`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                    {mood.icon}
                  </span>
                  {isActive && <CheckCircle2 className="w-5 h-5 text-white fill-white/20" />}
                </div>

                <div>
                  <h4 className="font-display font-black text-xs sm:text-sm tracking-wider uppercase">
                    {mood.label}
                  </h4>
                  <p
                    className={`text-[10px] font-sans line-clamp-1 mt-0.5 ${
                      isActive ? 'text-white/90' : 'text-gray-400'
                    }`}
                  >
                    {mood.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mood Selected Banner */}
        {activeOption && (
          <div className="glass-panel p-4 rounded-2xl border border-white/20 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in shadow-xl">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-3xl">{activeOption.icon}</span>
              <div>
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  {activeOption.label} MOOD ACTIVE
                </h4>
                <p className="text-xs text-gray-300 font-sans">{activeOption.description}</p>
              </div>
            </div>
            <div className="text-xs font-display font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-cineRed to-cineViolet text-white shadow-lg flex-shrink-0">
              {moodResults.length} TITLES MATCHED
            </div>
          </div>
        )}

        {/* Filtered Title Results */}
        {activeMood && (
          <div className="space-y-4 animate-fade-in">
            {loading ? (
              <CarouselSkeleton count={5} />
            ) : moodResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {moodResults.slice(0, 10).map((item, idx) => (
                  <MovieCard
                    key={`mood-${item.id}-${idx}`}
                    item={item}
                    mediaType="movie"
                    onPlayTrailer={handlePlayTrailer}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">No titles available for this mood.</div>
            )}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={activeTrailerTitle}
        trailers={activeTrailers}
      />
    </section>
  );
};
