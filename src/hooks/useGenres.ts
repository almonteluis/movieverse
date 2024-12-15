import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdb";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await tmdbApi.genres.getMovieGenres();
      // Get a backdrop image for each genre
      const genresWithImages = await Promise.all(
        data.genres.slice(0, 4).map(async (genre) => {
          const { data: movies } = await tmdbApi.genres.getMoviesByGenre(
            genre.id,
          );
          const backdrop = movies.results[0]?.backdrop_path;
          return {
            ...genre,
            backdrop_path: backdrop,
          };
        }),
      );
      return genresWithImages;
    },
  });
};
