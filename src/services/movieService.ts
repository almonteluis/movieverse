import axios from "axios";
import { type Movie, type Cast, type Video } from "@/types/movie";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const movieService = {
  getDetails: (movieId: number) =>
    axios.get<Movie>(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    }),

  getCredits: (movieId: number) =>
    axios.get<{ cast: Cast[] }>(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    }),

  // getVideos: (movieId: number) =>
  //   axios.get<{ results: Video[] }>(`${BASE_URL}/movie/${movieId}/videos`, {
  //     params: { api_key: API_KEY },
  //   }),

  getSimilar: (movieId: number) =>
    axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: 1,
      },
    }),

  // getRecommendations: (movieId: number) =>
  //   axios.get<{ results: Movie[] }>(
  //     `${BASE_URL}/movie/${movieId}/recommendations`,
  //     {
  //       params: { api_key: API_KEY },
  //     },
  //   ),

  //   getReviews: (movieId: string) =>
  //     axios.get<{ results: Review[] }>(`${BASE_URL}/movie/${movieId}/reviews`, {
  //       params: { api_key: API_KEY },
  //     }),
};
