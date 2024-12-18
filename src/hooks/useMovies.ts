import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../services/tmdb";
import { Movie } from "../types/api.types";

interface MovieResponse {
  results: Movie[];
  nextPage: number | undefined;
  hasMore: boolean;
}

interface DiscoverResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
  nextPage?: number;
  hasMore: boolean;
}

interface DiscoverParams {
  sort_by?: string;
  year?: number;
  with_genres?: string;
  "vote_average.gte"?: number;
  "primary_release_year"?: number;
}

export const useMovies = {
  useInfiniteMovies: (type: "now_playing" | "trending" | "top_rated" | "upcoming") => {
    return useInfiniteQuery<MovieResponse, Error, MovieResponse>({
      queryKey: ["movies", type],
      queryFn: ({ pageParam }) => tmdbApi.movies.fetchMovies(type, pageParam as number),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  },

  useInfiniteDiscover: (params: DiscoverParams) => {
    return useInfiniteQuery<DiscoverResponse, Error, DiscoverResponse>({
      queryKey: ["movies", "discover", params],
      queryFn: async ({ pageParam }) => {
        const result = await tmdbApi.movies.discover({
          ...params,
          page: pageParam as number,
        });
        return {
          ...result,
          nextPage: result.page < result.total_pages ? result.page + 1 : undefined,
          hasMore: result.page < result.total_pages,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  },

  // Helper function to flatten infinite query results
  getMoviesFromInfiniteQuery: (data: MovieResponse[] | undefined) => {
    if (!data) return [];
    return data.flatMap((page) => page.results);
  },

  // Legacy hooks maintained for backward compatibility
  useNowPlaying: () => {
    return useQuery<Movie[]>({
      queryKey: ["movies", "nowPlaying"],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getNowPlaying();
        return data.results;
      },
    });
  },

  useTrending: (timeWindow: string = "week", page: number = 1) => {
    return useQuery<MovieResponse>({
      queryKey: ["trending", timeWindow, page],
      queryFn: async () => {
        return tmdbApi.movies.fetchMovies("trending", page);
      },
    });
  },

  useTopRated: () => {
    return useQuery<Movie[]>({
      queryKey: ["movies", "topRated"],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getTopRated();
        return data.results;
      },
    });
  },

  useUpcoming: () => {
    return useQuery<Movie[]>({
      queryKey: ["movies", "upcoming"],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getUpcoming();
        return data.results;
      },
    });
  },
};
