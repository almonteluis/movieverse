import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/services/tmdb';
import { movieService } from '@/services/movieService';

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

  useTrending: (timeWindow: string = 'week', page: number = 1) => {
    return useQuery({
      queryKey: ['trending', timeWindow, page],
      queryFn: () => movieService.getTrending(timeWindow, page),
    //   keepPreviousData: true, // Keep old data while fetching new data
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