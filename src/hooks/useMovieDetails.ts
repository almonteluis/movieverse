// src/hooks/useMovie.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movieService";
import { tmdbService } from "@/services/tmdbService";

// Base movie details hook
export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      try {
        const { data } = await movieService.getDetails(movieId);
        return {
          ...data,
          formattedRuntime: tmdbService.formatRuntime(data.runtime),
          formattedReleaseDate: tmdbService.formatDate(data.release_date),
          posterUrl: tmdbService.getImageUrl(data.poster_path, "w500"),
          backdropUrl: tmdbService.getImageUrl(data.backdrop_path, "original"),
        };
      } catch (error) {
        console.error("Error fetching movie details:", error);
        throw new Error("Failed to fetch movie details");
      }
    },
    enabled: !!movieId,
  });
}

// Cast and crew hook
export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: async () => {
      const { data } = await movieService.getCredits(movieId);
      return {
        cast: data.cast.map((member) => ({
          ...member,
          profileUrl: tmdbService.getImageUrl(member.profile_path, "w185"),
        })),
        mainCast: data.cast.slice(0, 6),
        director: data.crew.find((person) => person.job === "Director"),
      };
    },
    enabled: !!movieId,
  });
}

// Videos hook with filtering
export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const { data } = await movieService.getVideos(movieId);
      return {
        allVideos: data.results,
        trailers: data.results.filter((video) => video.type === "Trailer"),
        teasers: data.results.filter((video) => video.type === "Teaser"),
        mainTrailer: data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube",
        ),
      };
    },
    enabled: !!movieId,
  });
}

// Reviews hook with pagination
// export function useMovieReviews(movieId: number) {
//   return useInfiniteQuery({
//     queryKey: ['movie', movieId, 'reviews'],
//     queryFn: async ({ pageParam = 1 }) => {
//       const { data } = await movieService.getReviews(movieId);
//       return {
//         ...data,
//         reviews: data.results.map(review => ({
//           ...review,
//           formattedDate: tmdbService.formatDate(review.created_at)
//         }))
//       };
//     },
//     getNextPageParam: (lastPage) =>
//       lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
//     enabled: !!movieId,
//   });
// }

// Similar movies hook with error handling
export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "similar"],
    queryFn: async () => {
      try {
        const { data } = await movieService.getSimilar(movieId);

        // Check if data and results exist
        if (!data || !data.results) {
          console.warn("No similar movies data received");
          return [];
        }

        return data.results.map((movie) => ({
          ...movie,
          posterUrl: tmdbService.getImageUrl(movie.poster_path, "w342"),
        }));
      } catch (error) {
        console.error("Error fetching similar movies:", error);
        return [];
      }
    },
    enabled: !!movieId,
  });
}

// Custom hook combining all movie data
export function useMovieData(movieId: number) {
  const { data: movie, isLoading: isLoadingMovie } = useMovieDetails(movieId);
  const { data: credits, isLoading: isLoadingCredits } =
    useMovieCredits(movieId);
  const { data: videos, isLoading: isLoadingVideos } = useMovieVideos(movieId);
  const { data: similar, isLoading: isLoadingSimilar } =
    useSimilarMovies(movieId);

  return {
    movie,
    credits,
    videos,
    similar,
    isLoading:
      isLoadingMovie || isLoadingCredits || isLoadingVideos || isLoadingSimilar,
    hasData: !!movie && !!credits && !!videos,
    isError: !movie || !credits || !videos,
  };
}

// Watchlist functionality hook
// export function useWatchlist() {
//   const [watchlist, setWatchlist] = useState<number[]>(() => {
//     const saved = localStorage.getItem('movie_watchlist');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const addToWatchlist = useCallback((movieId: number) => {
//     setWatchlist(prev => {
//       const newList = [...prev, movieId];
//       localStorage.setItem('movie_watchlist', JSON.numberify(newList));
//       return newList;
//     });
//   }, []);

//   const removeFromWatchlist = useCallback((movieId: number) => {
//     setWatchlist(prev => {
//       const newList = prev.filter(id => id !== movieId);
//       localStorage.setItem('movie_watchlist', JSON.stringify(newList));
//       return newList;
//     });
//   }, []);

//   return {
//     watchlist,
//     addToWatchlist,
//     removeFromWatchlist,
//     isInWatchlist: useCallback((movieId: number) =>
//       watchlist.includes(movieId), [watchlist])
//   };
// }
