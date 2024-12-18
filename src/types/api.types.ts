export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface StreamingSource {
  source_id: number;
  name: string;
  type: string;
  region: string;
  web_url: string;
  ios_url?: string;
  android_url?: string;
  format: string;
  price?: number;
  seasons?: number;
  episodes?: number;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  overview: string | null;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  runtime: number | null;
  budget?: number | null;
  revenue?: number | null;
  adult: boolean;
  popularity: number;
  video: boolean;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  streaming_sources?: StreamingSource[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  profileUrl: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

export interface Video {
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface SimilarMovie extends Movie {
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
  posterUrl: string;
}

export interface MovieDiscoverParams {
  page?: number;
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "vote_average.desc"
    | "vote_average.asc"
    | "release_date.desc"
    | "release_date.asc";
  include_adult?: boolean;
  include_video?: boolean;
  with_genres?: string;
  primary_release_year?: number;
  with_original_language?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
}
