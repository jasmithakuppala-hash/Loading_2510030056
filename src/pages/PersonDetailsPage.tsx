import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, Film, Tv, Sparkles } from 'lucide-react';
import { tmdbService, getProfileUrl } from '../services/tmdb';
import { Person, Movie, TVShow, VideoTrailer } from '../types';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';

export const PersonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const personId = Number(id);

  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  useEffect(() => {
    if (!personId) return;

    const fetchPersonData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          tmdbService.getPersonDetails(personId),
          tmdbService.getPersonCombinedCredits(personId),
        ]);

        setPerson(detailsRes);

        // Sort credits by popularity and filter valid titles
        const sortedCredits = (creditsRes || [])
          .filter((item) => item.poster_path)
          .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

        setCredits(sortedCredits);
      } catch (err) {
        console.error('Failed to fetch person details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [personId]);

  const handlePlayTrailer = async (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    const title = (item as Movie).title || (item as TVShow).name || 'Trailer';
    setActiveTrailerTitle(title);
    setTrailerModalOpen(true);
    try {
      const trailers =
        mediaType === 'tv'
          ? await tmdbService.getTVTrailers(item.id)
          : await tmdbService.getMovieTrailers(item.id);
      setActiveTrailers(trailers || []);
    } catch (err) {
      setActiveTrailers([]);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 animate-pulse space-y-8">
        <div className="w-full h-64 bg-cineDark-800 rounded-3xl" />
        <div className="w-1/2 h-10 bg-white/10 rounded-xl" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="pt-32 pb-16 min-h-screen text-center max-w-xl mx-auto px-4">
        <h2 className="font-display font-bold text-3xl text-white mb-4">Artist Not Found</h2>
        <Link
          to="/people"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-display font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to People
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/people"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-display font-bold uppercase transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to People
        </Link>
      </div>

      {/* Header Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Image */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative rounded-3xl overflow-hidden bg-cineDark-800 border border-white/15 shadow-2xl">
            <img
              src={getProfileUrl(person.profile_path)}
              alt={person.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
              }}
            />
          </div>
        </div>

        {/* Right Info */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-display font-bold uppercase tracking-widest mb-2">
              {person.known_for_department || 'Artist'}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              {person.name}
            </h1>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 font-semibold">
            {person.birthday && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Born: {person.birthday}</span>
              </span>
            )}
            {person.place_of_birth && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-cineRed" />
                <span>{person.place_of_birth}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Film className="w-3.5 h-3.5 text-cineBlue" />
              <span>{credits.length} Known Credits</span>
            </span>
          </div>

          {/* Biography */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400">
              BIOGRAPHY
            </h3>
            <p className="text-gray-200 font-sans text-sm sm:text-base leading-relaxed">
              {person.biography || `No biography available for ${person.name}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Filmography Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            KNOWN FILMOGRAPHY & TV CREDITS
          </h3>
        </div>

        {credits.length === 0 ? (
          <div className="py-12 text-center text-gray-400 glass-panel rounded-3xl border border-white/10">
            No filmography credits available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {credits.slice(0, 25).map((item, idx) => {
              const isTV = (item as TVShow).name !== undefined;
              return (
                <MovieCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  mediaType={isTV ? 'tv' : 'movie'}
                  onPlayTrailer={handlePlayTrailer}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={activeTrailerTitle}
        trailers={activeTrailers}
      />
    </div>
  );
};
