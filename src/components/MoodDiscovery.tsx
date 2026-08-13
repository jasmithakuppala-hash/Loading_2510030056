import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOOD_OPTIONS, useMood } from '../context/MoodContext';
import { MoodType, Movie, TVShow, VideoTrailer } from '../types';
import { tmdbService } from '../services/tmdb';
import { MovieCard } from './MovieCard';
import { CarouselSkeleton } from './LoadingSkeleton';
import { TrailerModal } from './TrailerModal';

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

  const handlePlayTrailer = async (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
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
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-cineRed/10 via-cineViolet/10 to-cineBlue/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cineRed/15 text-cineRed text-xs font-display font-bold uppercase tracking-widest mb-3 border border-cineRed/30">
            <Compass className="w-3.5 h-3.5" />
            <span>SIGNATURE ENGINE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            WHAT ARE YOU IN THE <span className="bg-clip-text text-transparent bg-gradient-to-r from-cineRed via-red-500 to-cineViolet">MOOD FOR?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-sans mt-2">
            Select a mood to dynamically filter titles personalized to your vibe right now.
          </p>
        </div>

        {/* 8 Mood Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {MOOD_OPTIONS.map((mood) => {
            const isActive = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => selectMood(mood.id)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none flex flex-col justify-between h-28 ${
                  isActive
                    ? 'bg-gradient-to-br from-cineRed via-red-600 to-cineViolet border-white text-white shadow-xl shadow-cineRed/30 scale-105 z-10'
                    : 'bg-cineDark-800/80 hover:bg-cineDark-800 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl sm:text-3xl transform group-hover:scale-110 transition-transform">
                    {mood.icon}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />}
                </div>

                <div>
                  <h4 className="font-display font-black text-xs sm:text-sm tracking-wider uppercase">
                    {mood.label}
                  </h4>
                  <p
                    className={`text-[10px] font-sans line-clamp-1 mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    {mood.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mood Selected Explanation Banner */}
        {activeOption && (
          <div className="glass-panel p-4 rounded-2xl border border-white/15 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl">{activeOption.icon}</span>
              <div>
                <h4 className="font-display font-bold text-sm text-white uppercase">
                  {activeOption.label} MOOD ACTIVE
                </h4>
                <p className="text-xs text-gray-400 font-sans">{activeOption.description}</p>
              </div>
            </div>
            <div className="text-xs font-display font-bold px-3 py-1.5 rounded-xl bg-cineRed/20 border border-cineRed/30 text-cineRed flex-shrink-0">
              {moodResults.length} TITLES SELECTED FOR YOUR MOOD
            </div>
          </div>
        )}

        {/* Dynamic Filtered Results Carousel / Grid */}
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
