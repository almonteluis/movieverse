import axios from "axios";
import { Movie, PaginatedResponse } from "../types/api.types";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApi = {
  // Helper for image URLs
  getImageUrl: (path: string | null, size = "original") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  
  formatRuntime: (minutes: number | null) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  },

  // Enhanced movies endpoints with pagination and error handling
  movies: {
    fetchMovies: async (
      type: "now_playing" | "trending" | "top_rated" | "upcoming",
      page: number = 1
    ): Promise<{
      results: Movie[];
      nextPage: number | undefined;
      hasMore: boolean;
    }> => {
      try {
        let endpoint = "";
        const params: Record<string, any> = {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page,
        };

        switch (type) {
          case "trending":
            endpoint = "/trending/movie/week";
            break;
          case "now_playing":
          case "top_rated":
          case "upcoming":
            endpoint = `/movie/${type}`;
            break;
          default:
            throw new Error("Invalid movie type");
        }

        const { data } = await axios.get<PaginatedResponse<Movie[]>>(
          `${BASE_URL}${endpoint}`,
          { params }
        );

        return {
          results: data.results,
          nextPage: page < data.total_pages ? page + 1 : undefined,
          hasMore: page < data.total_pages,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to fetch ${type} movies: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    },

    // Advanced discover endpoint with filters
    discover: async (params: {
      page?: number;
      sort_by?: string;
      year?: number;
      with_genres?: string;
      "vote_average.gte"?: number;
      "primary_release_year"?: number;
    }) => {
      try {
        const { data } = await axios.get<PaginatedResponse<Movie[]>>(
          `${BASE_URL}/discover/movie`,
          {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
              include_adult: false,
              ...params,
            },
          }
        );

        return {
          results: data.results,
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to discover movies: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    },

    // Original endpoints maintained for backward compatibility
    getNowPlaying: () =>
      axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),

    getTrending: () =>
      axios.get(`${BASE_URL}/trending/movie/week`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }),

    getTopRated: () =>
      axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),

    getUpcoming: () =>
      axios.get(`${BASE_URL}/movie/upcoming`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),

    getVideos: (movieId: number) =>
      axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }),
  },

  genres: {
    getMovieGenres: () =>
      axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }),

    getMoviesByGenre: (genreId: number) =>
      axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          sort_by: "popularity.desc",
          include_adult: false,
          page: 1,
        },
      }),
  },
};
