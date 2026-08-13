import React, { useState, useEffect } from 'react';
import { Flame, Film, Star, Tv, Clock, Sparkles } from 'lucide-react';
import { Movie, TVShow, VideoTrailer } from '../types';
import { tmdbService } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Hero } from '../components/Hero';
import { MovieCarousel } from '../components/MovieCarousel';
import { MoodDiscovery } from '../components/MoodDiscovery';
import { CuratedCollections } from '../components/CuratedCollections';
import { TrailerModal } from '../components/TrailerModal';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  // Trailer Modal State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  const { recentlyViewed, watchlist } = useWatchlist();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [trendingRes, popularMoviesRes, topRatedRes, popularTVRes] = await Promise.all([
          tmdbService.getTrending('all', 'week'),
          tmdbService.getPopularMovies(1),
          tmdbService.getTopRatedMovies(1),
          tmdbService.getPopularTV(1),
        ]);

        setTrending(trendingRes || []);
        setPopularMovies(popularMoviesRes || []);
        setTopRated(topRatedRes || []);
        setPopularTV(popularTVRes || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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
    } catch (error) {
      console.error('Failed to fetch trailers:', error);
      setActiveTrailers([]);
    }
  };

  return (
    <div className="min-h-screen bg-cineDark-900 text-white pb-16">
      {/* Featured Full-Screen Cinematic Hero */}
      <Hero items={trending} loading={loading} onPlayTrailer={handlePlayTrailer} />

      {/* Main Discovery Carousels & Signature Tools */}
      <div className="space-y-6 pt-6">
        {/* Recently Viewed Shelf (If exists in LocalStorage) */}
        {recentlyViewed.length > 0 && (
          <MovieCarousel
            title="CONTINUE EXPLORING"
            subtitle="Recently viewed movies & TV shows"
            items={recentlyViewed}
            variant="backdrop"
            icon={<Clock className="w-5 h-5 text-cineViolet" />}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {/* 1. Trending Now Carousel (With Rank Numbers) */}
        <MovieCarousel
          title="TRENDING NOW"
          subtitle="Top movies & shows exploding across Cineverse this week"
          items={trending}
          loading={loading}
          showRanks={true}
          viewAllPath="/movies"
          icon={<Flame className="w-5 h-5 text-cineRed" />}
          onPlayTrailer={handlePlayTrailer}
        />

        {/* SIGNATURE FEATURE 1: Mood Discovery Engine */}
        <MoodDiscovery />

        {/* 2. Popular Movies Carousel */}
        <MovieCarousel
          title="POPULAR MOVIES"
          subtitle="Blockbusters loved by audiences worldwide"
          items={popularMovies}
          loading={loading}
          mediaType="movie"
          viewAllPath="/movies"
          icon={<Film className="w-5 h-5 text-cineBlue" />}
          onPlayTrailer={handlePlayTrailer}
        />

        {/* SIGNATURE FEATURE 2: Personalized "BECAUSE YOU LIKE" Recommendation Shelf */}
        {watchlist.length > 0 && (
          <MovieCarousel
            title="BASED ON YOUR WATCHLIST"
            subtitle="Personalized recommendations derived from your saved movies & TV shows"
            items={popularMovies.slice(5, 15)}
            loading={loading}
            mediaType="movie"
            icon={<Sparkles className="w-5 h-5 text-cineRed" />}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {/* 3. Top Rated Carousel (Backdrop Variant) */}
        <MovieCarousel
          title="CRITICALLY ACCLAIMED & TOP RATED"
          subtitle="Masterpieces with the highest rating scores"
          items={topRated}
          loading={loading}
          mediaType="movie"
          variant="backdrop"
          viewAllPath="/movies"
          icon={<Star className="w-5 h-5 text-amber-400" />}
          onPlayTrailer={handlePlayTrailer}
        />

        {/* SIGNATURE FEATURE 3: Curated Editorial Collections */}
        <CuratedCollections />

        {/* 4. Popular TV Shows Carousel */}
        <MovieCarousel
          title="POPULAR TV SERIES"
          subtitle="Binge-worthy series, dramas, and sci-fi hits"
          items={popularTV}
          loading={loading}
          mediaType="tv"
          viewAllPath="/tv"
          icon={<Tv className="w-5 h-5 text-cineViolet" />}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      {/* Cinematic Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={activeTrailerTitle}
        trailers={activeTrailers}
      />
    </div>
  );
};
