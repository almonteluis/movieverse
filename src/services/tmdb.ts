import axios from "axios";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const tmdbApi = {
  // Helper for image URLs
  getImageUrl: (path: string | null, size: string = "original") => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Endpoints
  movies: {
    // Featured/Hero section
    getNowPlaying: () =>
      axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),

    // Trending movies
    getTrending: () =>
      axios.get(`${BASE_URL}/trending/movie/week`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }),

    // Top rated movies
    getTopRated: () =>
      axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),

    // Upcoming movies
    getUpcoming: () =>
      axios.get(`${BASE_URL}/movie/upcoming`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }),
  },
};
