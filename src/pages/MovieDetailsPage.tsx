import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Bookmark, Clock, Calendar, Star, Film, ArrowLeft, Users, Sparkles, Check, ChevronRight } from 'lucide-react';
import { tmdbService, getBackdropUrl, getImageUrl, getProfileUrl } from '../services/tmdb';
import { Movie, CastMember, CrewMember, VideoTrailer } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { Rating } from '../components/Rating';
import { TrailerModal } from '../components/TrailerModal';
import { MovieCarousel } from '../components/MovieCarousel';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailers, setTrailers] = useState<VideoTrailer[]>([]);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist, addRecentlyViewed } = useWatchlist();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, creditsRes, trailersRes, similarRes, recsRes] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          tmdbService.getMovieCredits(movieId),
          tmdbService.getMovieTrailers(movieId),
          tmdbService.getSimilarMovies(movieId),
          tmdbService.getMovieRecommendations(movieId),
        ]);

        setMovie(detailsRes);
        setCast(creditsRes.cast || []);
        setCrew(creditsRes.crew || []);
        setTrailers(trailersRes || []);
        setSimilar(similarRes || []);
        setRecommendations(recsRes || []);

        if (detailsRes) {
          addRecentlyViewed(detailsRes, 'movie');
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 animate-pulse space-y-8">
        <div className="w-full h-96 bg-cineDark-800 rounded-3xl" />
        <div className="w-3/4 h-10 bg-white/10 rounded-xl" />
        <div className="w-full h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-32 pb-16 min-h-screen text-center max-w-xl mx-auto px-4">
        <h2 className="font-display font-bold text-3xl text-white mb-4">Movie Not Found</h2>
        <p className="text-gray-400 mb-6">We couldn't retrieve the requested movie details.</p>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cineRed text-white font-display font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Movies
        </Link>
      </div>
    );
  }

  const releaseYear = (movie.release_date || '').slice(0, 4);
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;
  const runtimeStr = movie.runtime ? `${runtimeHours}h ${runtimeMins}m` : null;
  const inWatchlist = isInWatchlist(movie.id, 'movie');

  // Key Crew Members (Directors & Writers)
  const directors = crew.filter((c) => c.job === 'Director');
  const writers = crew.filter((c) => c.job === 'Screenplay' || c.job === 'Writer');

  return (
    <div className="min-h-screen bg-cineDark-900 text-white pb-20">
      {/* Hero Backdrop Header */}
      <div className="relative w-full min-h-[65vh] lg:min-h-[75vh] flex items-end bg-black overflow-hidden">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-cineDark-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cineDark-900 via-cineDark-900/80 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <Link
            to="/movies"
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
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
            </div>
          </div>

          {/* Right Metadata Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              {movie.tagline && (
                <p className="text-cineRed font-display font-semibold text-xs uppercase tracking-widest mb-2">
                  "{movie.tagline}"
                </p>
              )}
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
                {movie.title}
              </h1>
            </div>

            {/* Badges & Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <Rating score={movie.vote_average} size="md" showMax />
              {releaseYear && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-cineBlue" />
                  <span>{movie.release_date}</span>
                </span>
              )}
              {runtimeStr && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-cineViolet" />
                  <span>{runtimeStr}</span>
                </span>
              )}
              {movie.status && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres Pills */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((g) => (
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
                OVERVIEW
              </h3>
              <p className="text-gray-200 font-sans text-base leading-relaxed">
                {movie.overview || 'No overview available for this title.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Watch Trailer CTA */}
              <button
                onClick={() => setTrailerModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cineRed via-red-600 to-cineRed text-white font-display font-bold text-sm tracking-wider uppercase flex items-center gap-3 shadow-xl shadow-cineRed/30 hover:shadow-cineRed/50 hover:scale-105 transition-all focus:outline-none"
              >
                <Play className="w-5 h-5 fill-white ml-0.5" />
                <span>WATCH TRAILER</span>
              </button>

              {/* Add / Remove Watchlist */}
              <button
                onClick={() => {
                  if (inWatchlist) removeFromWatchlist(movie.id, 'movie');
                  else addToWatchlist(movie, 'movie');
                }}
                className={`px-7 py-4 rounded-2xl font-display font-bold text-sm tracking-wider uppercase flex items-center gap-3 border transition-all focus:outline-none ${
                  inWatchlist
                    ? 'bg-white/15 border-cineRed text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border-white/20 text-gray-200 hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${inWatchlist ? 'fill-cineRed text-cineRed' : ''}`} />
                <span>{inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
              </button>
            </div>

            {/* Directors & Writers Info */}
            {(directors.length > 0 || writers.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                {directors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase tracking-wider text-gray-400">
                      DIRECTOR
                    </h4>
                    <p className="text-sm font-semibold text-white mt-1">
                      {directors.map((d) => d.name).join(', ')}
                    </p>
                  </div>
                )}
                {writers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase tracking-wider text-gray-400">
                      SCREENPLAY / WRITERS
                    </h4>
                    <p className="text-sm font-semibold text-white mt-1">
                      {writers.map((w) => w.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-cineRed" />
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
                  <h4 className="font-display font-bold text-xs text-white line-clamp-1 group-hover:text-cineRed transition-colors">
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

        {/* Similar & Recommended Movies Carousels */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieCarousel
              title="SIMILAR MOVIES"
              subtitle="More films like this one"
              items={similar}
              mediaType="movie"
              icon={<Film className="w-5 h-5 text-cineBlue" />}
            />
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6">
            <MovieCarousel
              title="RECOMMENDED FOR YOU"
              subtitle="Hand-picked titles based on this movie"
              items={recommendations}
              mediaType="movie"
              icon={<Sparkles className="w-5 h-5 text-cineViolet" />}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={movie.title}
        trailers={trailers}
      />
    </div>
  );
};
