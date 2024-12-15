import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/services/tmdb';

export const useMovies = {
  useNowPlaying: () => {
    return useQuery({
      queryKey: ['movies', 'nowPlaying'],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getNowPlaying();
        return data.results;
      }
    });
  },

  useTrending: () => {
    return useQuery({
      queryKey: ['movies', 'trending'],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getTrending();
        return data.results;
      }
    });
  },

  useTopRated: () => {
    return useQuery({
      queryKey: ['movies', 'topRated'],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getTopRated();
        return data.results;
      }
    });
  },

  useUpcoming: () => {
    return useQuery({
      queryKey: ['movies', 'upcoming'],
      queryFn: async () => {
        const { data } = await tmdbApi.movies.getUpcoming();
        return data.results;
      }
    });
  }
};