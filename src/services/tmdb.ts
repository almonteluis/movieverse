import axios from "axios";

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

    // Get Video
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
