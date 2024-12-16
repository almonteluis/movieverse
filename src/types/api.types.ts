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

export interface Movie {
  id: number;
  title: string;
  overview: string | null;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  runtime: number | null;
  genres?: Array<{
    id: number;
    name: string;
  }>;
}
