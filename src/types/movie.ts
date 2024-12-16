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
  posterUrl: string; // This is the processed URL from the TMDB service
}
