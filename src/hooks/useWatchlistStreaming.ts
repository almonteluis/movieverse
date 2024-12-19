import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Movie, StreamingSource } from "../types/api.types";
import { watchmodeApi } from "../services/watchmode";

interface MovieWithStreaming extends Movie {
  streaming_sources: StreamingSource[];
}

export const useWatchlistStreaming = () => {
  const watchlist = useStore((state) => state.watchlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesWithStreaming, setMoviesWithStreaming] = useState<
    MovieWithStreaming[]
  >([]);

  useEffect(() => {
    const fetchStreamingInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const updatedMovies = await Promise.all(
          watchlist.map(async (movie) => {
            // Skip if we already have streaming sources
            if (movie.streaming_sources) {
              return movie as MovieWithStreaming;
            }

            const sources = await watchmodeApi.getStreamingInfoForMovie(
              movie.id,
            );

            return {
              ...movie,
              streaming_sources: sources,
            };
          }),
        );

        setMoviesWithStreaming(updatedMovies);
      } catch (err) {
        setError("Failed to fetch streaming information");
        console.error("Error fetching streaming info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingInfo();
  }, [watchlist]);

  // Group movies by streaming service
  const moviesByService = moviesWithStreaming.reduce(
    (acc, movie) => {
      if (!movie.streaming_sources?.length) {
        acc["Not Available"] = [...(acc["Not Available"] || []), movie];
        return acc;
      }

      movie.streaming_sources.forEach((source) => {
        acc[source.name] = [...(acc[source.name] || []), movie];
      });

      return acc;
    },
    {} as Record<string, MovieWithStreaming[]>,
  );

  return {
    loading,
    error,
    moviesByService,
  };
};
