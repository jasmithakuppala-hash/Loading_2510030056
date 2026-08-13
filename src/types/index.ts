export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  status?: string;
  media_type?: 'movie' | 'tv' | 'person';
  first_air_date?: string; // For TV compatibility
  name?: string; // For TV compatibility
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  media_type?: 'movie' | 'tv' | 'person';
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for?: (Movie | TVShow)[];
  media_type?: 'person';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface WatchlistItem {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  genres?: string[];
  addedAt: number;
}

export type MoodType = 
  | 'adrenaline' 
  | 'mind-bending' 
  | 'romance' 
  | 'feel-good' 
  | 'dark' 
  | 'sci-fi' 
  | 'emotional' 
  | 'drama';

export interface MoodOption {
  id: MoodType;
  label: string;
  icon: string;
  description: string;
  genreIds: number[];
}
