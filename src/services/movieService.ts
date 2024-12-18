import axios from "axios";
import {
  type Movie,
  type Cast,
  type Video,
  Crew,
  MovieResponse,
  MovieDiscoverParams,
} from "@/types/api.types";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const movieService = {
  getDetails: (movieId: number) =>
    axios.get<Movie>(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    }),

  getCredits: (movieId: number) =>
    axios.get<{ cast: Cast[]; crew: Crew[] }>(
      `${BASE_URL}/movie/${movieId}/credits`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      },
    ),

  getVideos: (movieId: number) =>
    axios.get<{ results: Video[] }>(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY },
    }),

  getSimilar: (movieId: number) =>
    axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: 1,
      },
    }),

  getRecommendations: (movieId: number) =>
    axios.get<{ results: Movie[] }>(
      `${BASE_URL}/movie/${movieId}/recommendations`,
      {
        params: { api_key: TMDB_API_KEY },
      },
    ),

  getTrending: async (timeWindow: string, page: number) => {
    const { data } = await axios.get<{ results: Movie[]; total_pages: number }>(
      `${BASE_URL}/trending/movie/${timeWindow}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      },
    );
    return data;
  },

  async discoverMovies(params: MovieDiscoverParams): Promise<MovieResponse> {
    const searchParmas = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...(params as Record<string, string>),
    });

    const response = await fetch(
      `${BASE_URL}/discover/movie?${searchParmas.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    return response.json();
  },

  // getReviews: (movieId: number) =>
  //   axios.get<{ results: Review[] }>(`${BASE_URL}/movie/${movieId}/reviews`, {
  //     params: { api_key: TMDB_API_KEY },
  //   }),
};
