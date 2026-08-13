import axios from 'axios';
import { Movie, TVShow, Person, CastMember, CrewMember, VideoTrailer, Genre } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8956ae5b10a273b40cfd68ca1bf92a54';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image URL Builders
export const getImageUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'; // Cinematic fallback
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&auto=format&fit=crop'; // High-res fallback
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path: string | null): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
  }
  return `${IMAGE_BASE_URL}/w185${path}`;
};

// Genre Map Cache
let genreMapCache: Record<number, string> | null = null;

export const fetchGenreMap = async (): Promise<Record<number, string>> => {
  if (genreMapCache) return genreMapCache;
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdbClient.get('/genre/movie/list'),
      tmdbClient.get('/genre/tv/list'),
    ]);
    const map: Record<number, string> = {};
    movieGenres.data.genres.forEach((g: Genre) => { map[g.id] = g.name; });
    tvGenres.data.genres.forEach((g: Genre) => { map[g.id] = g.name; });
    genreMapCache = map;
    return map;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return {};
  }
};

// API Services
export const tmdbService = {
  // Trending
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    const response = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data.results as (Movie | TVShow)[];
  },

  // Popular Movies
  getPopularMovies: async (page = 1) => {
    const response = await tmdbClient.get('/movie/popular', { params: { page } });
    return response.data.results as Movie[];
  },

  // Top Rated Movies
  getTopRatedMovies: async (page = 1) => {
    const response = await tmdbClient.get('/movie/top_rated', { params: { page } });
    return response.data.results as Movie[];
  },

  // Popular TV Shows
  getPopularTV: async (page = 1) => {
    const response = await tmdbClient.get('/tv/popular', { params: { page } });
    return response.data.results as TVShow[];
  },

  // Movie Details
  getMovieDetails: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}`);
    return response.data as Movie;
  },

  // TV Details
  getTVDetails: async (id: number) => {
    const response = await tmdbClient.get(`/tv/${id}`);
    return response.data as TVShow;
  },

  // Credits (Movie)
  getMovieCredits: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}/credits`);
    return {
      cast: response.data.cast as CastMember[],
      crew: response.data.crew as CrewMember[],
    };
  },

  // Credits (TV)
  getTVCredits: async (id: number) => {
    const response = await tmdbClient.get(`/tv/${id}/credits`);
    return {
      cast: response.data.cast as CastMember[],
      crew: response.data.crew as CrewMember[],
    };
  },

  // Videos / Trailers
  getMovieTrailers: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}/videos`);
    return response.data.results as VideoTrailer[];
  },

  getTVTrailers: async (id: number) => {
    const response = await tmdbClient.get(`/tv/${id}/videos`);
    return response.data.results as VideoTrailer[];
  },

  // Similar & Recommendations
  getSimilarMovies: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}/similar`);
    return response.data.results as Movie[];
  },

  getMovieRecommendations: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}/recommendations`);
    return response.data.results as Movie[];
  },

  getSimilarTV: async (id: number) => {
    const response = await tmdbClient.get(`/tv/${id}/similar`);
    return response.data.results as TVShow[];
  },

  // Search Multi
  searchMulti: async (query: string, page = 1) => {
    if (!query.trim()) return [];
    const response = await tmdbClient.get('/search/multi', {
      params: { query, page, include_adult: false },
    });
    return response.data.results as (Movie | TVShow | Person)[];
  },

  // Discover / Filter Movies & TV
  discoverContent: async (type: 'movie' | 'tv', params: Record<string, any>) => {
    const response = await tmdbClient.get(`/discover/${type}`, { params });
    return response.data.results;
  },

  // Popular People
  getPopularPeople: async (page = 1) => {
    const response = await tmdbClient.get('/person/popular', { params: { page } });
    return response.data.results as Person[];
  },

  // Person Details
  getPersonDetails: async (id: number) => {
    const response = await tmdbClient.get(`/person/${id}`);
    return response.data as Person;
  },

  // Person Credits
  getPersonCombinedCredits: async (id: number) => {
    const response = await tmdbClient.get(`/person/${id}/combined_credits`);
    return response.data.cast as (Movie | TVShow)[];
  },

  // Genres List
  getGenres: async (mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await tmdbClient.get(`/genre/${mediaType}/list`);
    return response.data.genres as Genre[];
  },
};
