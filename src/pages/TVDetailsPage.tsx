import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Bookmark, Calendar, Tv, ArrowLeft, Users, Sparkles, Layers } from 'lucide-react';
import { tmdbService, getBackdropUrl, getImageUrl, getProfileUrl } from '../services/tmdb';
import { TVShow, CastMember, CrewMember, VideoTrailer } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { Rating } from '../components/Rating';
import { TrailerModal } from '../components/TrailerModal';
import { MovieCarousel } from '../components/MovieCarousel';

export const TVDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);

  const [show, setShow] = useState<TVShow | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [similar, setSimilar] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailers, setTrailers] = useState<VideoTrailer[]>([]);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist, addRecentlyViewed } = useWatchlist();

  useEffect(() => {
    if (!tvId) return;

    const fetchTVData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, creditsRes, trailersRes, similarRes] = await Promise.all([
          tmdbService.getTVDetails(tvId),
          tmdbService.getTVCredits(tvId),
          tmdbService.getTVTrailers(tvId),
          tmdbService.getSimilarTV(tvId),
        ]);

        setShow(detailsRes);
        setCast(creditsRes.cast || []);
        setCrew(creditsRes.crew || []);
        setTrailers(trailersRes || []);
        setSimilar(similarRes || []);

        if (detailsRes) {
          addRecentlyViewed(detailsRes, 'tv');
        }
      } catch (err) {
        console.error('Error fetching TV details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [tvId]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 animate-pulse space-y-8">
        <div className="w-full h-96 bg-cineDark-800 rounded-3xl" />
        <div className="w-3/4 h-10 bg-white/10 rounded-xl" />
        <div className="w-full h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="pt-32 pb-16 min-h-screen text-center max-w-xl mx-auto px-4">
        <h2 className="font-display font-bold text-3xl text-white mb-4">TV Series Not Found</h2>
        <p className="text-gray-400 mb-6">We couldn't retrieve the requested TV series details.</p>
        <Link
          to="/tv"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cineViolet text-white font-display font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to TV Shows
        </Link>
      </div>
    );
  }

  const firstAirYear = (show.first_air_date || '').slice(0, 4);
  const inWatchlist = isInWatchlist(show.id, 'tv');

  return (
    <div className="min-h-screen bg-cineDark-900 text-white pb-20">
      {/* Hero Backdrop Header */}
      <div className="relative w-full min-h-[65vh] lg:min-h-[75vh] flex items-end bg-black overflow-hidden">
        <img
          src={getBackdropUrl(show.backdrop_path, 'original')}
          alt={show.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-cineDark-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cineDark-900 via-cineDark-900/80 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <Link
            to="/tv"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-gray-300 hover:text-white text-xs font-display font-bold uppercase transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      {/* Main Details Section Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-64">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Poster Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden bg-cineDark-800 border border-white/15 shadow-2xl group">
              <img
                src={getImageUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
            </div>
          </div>

          {/* Right Metadata Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              {show.tagline && (
                <p className="text-cineViolet font-display font-semibold text-xs uppercase tracking-widest mb-2">
                  "{show.tagline}"
                </p>
              )}
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
                {show.name}
              </h1>
            </div>

            {/* Badges & Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <Rating score={show.vote_average} size="md" showMax />
              {firstAirYear && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-cineBlue" />
                  <span>First Aired {firstAirYear}</span>
                </span>
              )}
              {show.number_of_seasons && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cineViolet/20 text-purple-300 border border-cineViolet/30 text-xs font-bold uppercase">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{show.number_of_seasons} SEASONS</span>
                </span>
              )}
              {show.number_of_episodes && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold">
                  {show.number_of_episodes} EPISODES
                </span>
              )}
            </div>

            {/* Genres Pills */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {show.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 text-xs font-display font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400">
                SERIES OVERVIEW
              </h3>
              <p className="text-gray-200 font-sans text-base leading-relaxed">
                {show.overview || 'No overview available for this series.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Watch Trailer CTA */}
              <button
                onClick={() => setTrailerModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cineViolet via-purple-600 to-cineViolet text-white font-display font-bold text-sm tracking-wider uppercase flex items-center gap-3 shadow-xl shadow-cineViolet/30 hover:shadow-cineViolet/50 hover:scale-105 transition-all focus:outline-none"
              >
                <Play className="w-5 h-5 fill-white ml-0.5" />
                <span>WATCH TRAILER</span>
              </button>

              {/* Add / Remove Watchlist */}
              <button
                onClick={() => {
                  if (inWatchlist) removeFromWatchlist(show.id, 'tv');
                  else addToWatchlist(show, 'tv');
                }}
                className={`px-7 py-4 rounded-2xl font-display font-bold text-sm tracking-wider uppercase flex items-center gap-3 border transition-all focus:outline-none ${
                  inWatchlist
                    ? 'bg-white/15 border-cineViolet text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border-white/20 text-gray-200 hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${inWatchlist ? 'fill-cineViolet text-cineViolet' : ''}`} />
                <span>{inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-cineViolet" />
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                TOP CAST & CREW
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.slice(0, 12).map((person) => (
                <Link
                  key={person.id}
                  to={`/person/${person.id}`}
                  className="group glass-panel p-3 rounded-2xl border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all text-center"
                >
                  <img
                    src={getProfileUrl(person.profile_path)}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border border-white/10 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <h4 className="font-display font-bold text-xs text-white line-clamp-1 group-hover:text-cineViolet transition-colors">
                    {person.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans line-clamp-1 mt-0.5">
                    {person.character}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar TV Shows Carousel */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieCarousel
              title="SIMILAR TV SERIES"
              subtitle="More shows you might enjoy"
              items={similar}
              mediaType="tv"
              icon={<Tv className="w-5 h-5 text-cineViolet" />}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={show.name}
        trailers={trailers}
      />
    </div>
  );
};
