import axios from 'axios';
import { Movie, TVShow, Person, CastMember, CrewMember, VideoTrailer, Genre } from '../types';
import { FEATURED_TITLES } from '../data/featuredContent';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8956ae5b10a273b40cfd68ca1bf92a54';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image URL Builders with Robust Fallback & Direct URL Handling
export const getImageUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original'): string => {
  if (!path) {
    return 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo6LEuPJevZzB.jpg';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path: string | null): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
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
    return {};
  }
};

// Auxiliary Fallback Data Filtering Helpers
const getFeaturedMovies = () => FEATURED_TITLES.filter((item) => (item as Movie).title) as Movie[];
const getFeaturedTV = () => FEATURED_TITLES.filter((item) => (item as TVShow).name) as TVShow[];

// API Services
export const tmdbService = {
  // Trending
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    try {
      const response = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`);
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as (Movie | TVShow)[];
      }
      return FEATURED_TITLES;
    } catch {
      return FEATURED_TITLES;
    }
  },

  // Popular Movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbClient.get('/movie/popular', { params: { page } });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as Movie[];
      }
      return getFeaturedMovies();
    } catch {
      return getFeaturedMovies();
    }
  },

  // Top Rated Movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await tmdbClient.get('/movie/top_rated', { params: { page } });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as Movie[];
      }
      return getFeaturedMovies().sort((a, b) => b.vote_average - a.vote_average);
    } catch {
      return getFeaturedMovies().sort((a, b) => b.vote_average - a.vote_average);
    }
  },

  // Popular TV Shows
  getPopularTV: async (page = 1) => {
    try {
      const response = await tmdbClient.get('/tv/popular', { params: { page } });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as TVShow[];
      }
      return getFeaturedTV();
    } catch {
      return getFeaturedTV();
    }
  },

  // Movie Details
  getMovieDetails: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${id}`);
      return response.data as Movie;
    } catch {
      const found = FEATURED_TITLES.find((m) => m.id === id) as Movie;
      return found || getFeaturedMovies()[0];
    }
  },

  // TV Details
  getTVDetails: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/tv/${id}`);
      return response.data as TVShow;
    } catch {
      const found = FEATURED_TITLES.find((m) => m.id === id) as TVShow;
      return found || getFeaturedTV()[0];
    }
  },

  // Credits (Movie)
  getMovieCredits: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${id}/credits`);
      return {
        cast: response.data.cast as CastMember[],
        crew: response.data.crew as CrewMember[],
      };
    } catch {
      return {
        cast: [
          { id: 1, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: 'https://image.tmdb.org/t/p/w185/33f5d5qg7a52f.jpg', order: 1 },
          { id: 2, name: 'Matthew McConaughey', character: 'Cooper', profile_path: 'https://image.tmdb.org/t/p/w185/eP140d393.jpg', order: 2 },
          { id: 3, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: 'https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0L9jUr0vRj.jpg', order: 3 },
          { id: 4, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: 'https://image.tmdb.org/t/p/w185/b7V2L4j9b3.jpg', order: 4 },
        ],
        crew: [
          { id: 10, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profile_path: null },
        ],
      };
    }
  },

  // Credits (TV)
  getTVCredits: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/tv/${id}/credits`);
      return {
        cast: response.data.cast as CastMember[],
        crew: response.data.crew as CrewMember[],
      };
    } catch {
      return {
        cast: [
          { id: 20, name: 'Bryan Cranston', character: 'Walter White', profile_path: null, order: 1 },
          { id: 21, name: 'Millie Bobby Brown', character: 'Eleven', profile_path: null, order: 2 },
          { id: 22, name: 'Jenna Ortega', character: 'Wednesday Addams', profile_path: null, order: 3 },
        ],
        crew: [],
      };
    }
  },

  // Videos / Trailers
  getMovieTrailers: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${id}/videos`);
      return response.data.results as VideoTrailer[];
    } catch {
      return [{ id: '1', key: 'zSWdZVtXT7E', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }];
    }
  },

  getTVTrailers: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/tv/${id}/videos`);
      return response.data.results as VideoTrailer[];
    } catch {
      return [{ id: '1', key: 'b9EkMc79ZSU', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }];
    }
  },

  // Similar & Recommendations
  getSimilarMovies: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${id}/similar`);
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as Movie[];
      }
      return getFeaturedMovies().filter((m) => m.id !== id);
    } catch {
      return getFeaturedMovies().filter((m) => m.id !== id);
    }
  },

  getMovieRecommendations: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${id}/recommendations`);
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as Movie[];
      }
      return getFeaturedMovies().filter((m) => m.id !== id);
    } catch {
      return getFeaturedMovies().filter((m) => m.id !== id);
    }
  },

  getSimilarTV: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/tv/${id}/similar`);
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as TVShow[];
      }
      return getFeaturedTV().filter((t) => t.id !== id);
    } catch {
      return getFeaturedTV().filter((t) => t.id !== id);
    }
  },

  // Search Multi
  searchMulti: async (query: string, page = 1) => {
    if (!query.trim()) return [];
    try {
      const response = await tmdbClient.get('/search/multi', {
        params: { query, page, include_adult: false },
      });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as (Movie | TVShow | Person)[];
      }
    } catch {
      // Fallback local search
    }
    const q = query.toLowerCase();
    return FEATURED_TITLES.filter((item) => {
      const title = (item as Movie).title || (item as TVShow).name || '';
      return title.toLowerCase().includes(q);
    });
  },

  // Discover / Filter Movies & TV
  discoverContent: async (type: 'movie' | 'tv', params: Record<string, any>) => {
    try {
      const response = await tmdbClient.get(`/discover/${type}`, { params });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results;
      }
    } catch {
      // Fallback local discover
    }
    return type === 'movie' ? getFeaturedMovies() : getFeaturedTV();
  },

  // Popular People
  getPopularPeople: async (page = 1) => {
    try {
      const response = await tmdbClient.get('/person/popular', { params: { page } });
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results as Person[];
      }
    } catch {
      // Fallback
    }
    return [
      { id: 525, name: 'Christopher Nolan', profile_path: 'https://image.tmdb.org/t/p/w185/z847120a5a54a.jpg', known_for_department: 'Directing' },
      { id: 2038, name: 'Cillian Murphy', profile_path: 'https://image.tmdb.org/t/p/w185/33f5d5qg7a52f.jpg', known_for_department: 'Acting' },
      { id: 10296, name: 'Matthew McConaughey', profile_path: 'https://image.tmdb.org/t/p/w185/eP140d393.jpg', known_for_department: 'Acting' },
      { id: 6193, name: 'Leonardo DiCaprio', profile_path: 'https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0L9jUr0vRj.jpg', known_for_department: 'Acting' },
      { id: 3894, name: 'Christian Bale', profile_path: 'https://image.tmdb.org/t/p/w185/b7V2L4j9b3.jpg', known_for_department: 'Acting' },
      { id: 1190668, name: 'Timothée Chalamet', profile_path: 'https://image.tmdb.org/t/p/w185/n6brmg29m9STmDMsBq7V9uYvMTd.jpg', known_for_department: 'Acting' },
    ] as Person[];
  },

  // Person Details
  getPersonDetails: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/person/${id}`);
      return response.data as Person;
    } catch {
      return {
        id,
        name: 'Christopher Nolan',
        profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        biography: 'Christopher Edward Nolan is a British-American film director, producer, and screenwriter. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
        known_for_department: 'Directing',
        birthday: '1970-07-30',
        place_of_birth: 'London, England, UK',
      } as Person;
    }
  },

  // Person Credits
  getPersonCombinedCredits: async (id: number) => {
    try {
      const response = await tmdbClient.get(`/person/${id}/combined_credits`);
      if (response.data.cast && response.data.cast.length > 0) {
        return response.data.cast as (Movie | TVShow)[];
      }
    } catch {
      // Fallback
    }
    return getFeaturedMovies();
  },

  // Genres List
  getGenres: async (mediaType: 'movie' | 'tv' = 'movie') => {
    try {
      const response = await tmdbClient.get(`/genre/${mediaType}/list`);
      return response.data.genres as Genre[];
    } catch {
      return [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Horror' },
        { id: 878, name: 'Sci-Fi' },
        { id: 53, name: 'Thriller' },
      ];
    }
  },
};
