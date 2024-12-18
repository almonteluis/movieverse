import axios from "axios";
import { Movie, PaginatedResponse } from "../types/api.types";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is not defined in environment variables');
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      console.error('TMDB API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
    }
    return Promise.reject(error);
  }
);

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
    // Add search endpoint
    search: async (query: string, page: number = 1) => {
      try {
        const { data } = await axiosInstance.get<PaginatedResponse<Movie[]>>(
          `/search/movie`,
          {
            params: {
              language: "en-US",
              query,
              page,
              include_adult: false,
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
        console.error('Search movies error:', error);
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to search movies: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    },

    fetchMovies: async (
      type: "now_playing" | "trending" | "top_rated" | "upcoming",
      page: number = 1,
      timeWindow: string = "week"
    ): Promise<{
      results: Movie[];
      nextPage: number | undefined;
      hasMore: boolean;
    }> => {
      try {
        let endpoint = "";
        const params: Record<string, any> = {
          language: "en-US",
          page,
        };

        switch (type) {
          case "trending":
            endpoint = `/trending/movie/${timeWindow}`;
            break;
          case "now_playing":
          case "top_rated":
          case "upcoming":
            endpoint = `/movie/${type}`;
            break;
          default:
            throw new Error("Invalid movie type");
        }

        console.log('Fetching movies:', { endpoint, params });
        const { data } = await axiosInstance.get<PaginatedResponse<Movie[]>>(
          endpoint,
          { params }
        );

        return {
          results: data.results,
          nextPage: page < data.total_pages ? page + 1 : undefined,
          hasMore: page < data.total_pages,
        };
      } catch (error) {
        console.error('Fetch movies error:', error);
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
        const { data } = await axiosInstance.get<PaginatedResponse<Movie[]>>(
          `/discover/movie`,
          {
            params: {
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
        console.error('Discover movies error:', error);
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
      axiosInstance.get(`/movie/now_playing`, {
        params: {
          language: "en-US",
          page: 1,
        },
      }),

    getTrending: () =>
      axiosInstance.get(`/trending/movie/week`, {
        params: {
          language: "en-US",
        },
      }),

    getTopRated: () =>
      axiosInstance.get(`/movie/top_rated`, {
        params: {
          language: "en-US",
          page: 1,
        },
      }),

    getUpcoming: () =>
      axiosInstance.get(`/movie/upcoming`, {
        params: {
          language: "en-US",
          page: 1,
        },
      }),

    getVideos: (movieId: number) =>
      axiosInstance.get(`/movie/${movieId}/videos`, {
        params: {
          language: "en-US",
        },
      }),
  },

  genres: {
    getMovieGenres: () =>
      axiosInstance.get(`/genre/movie/list`, {
        params: {
          language: "en-US",
        },
      }),

    getMoviesByGenre: (genreId: number) =>
      axiosInstance.get(`/discover/movie`, {
        params: {
          with_genres: genreId,
          sort_by: "popularity.desc",
          include_adult: false,
          page: 1,
        },
      }),
  },
};
