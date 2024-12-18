import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../services/tmdb";
import { Video } from "../types/api.types";

interface UseHoverTrailerResult {
  showTrailer: boolean;
  videoData: Video | undefined;
  isLoadingVideo: boolean;
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export function useHoverTrailer(movieId: number): UseHoverTrailerResult {
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch video data with React Query
  const {
    data: videoData,
    isLoading: isLoadingVideo,
  } = useQuery({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const { data } = await tmdbApi.movies.getVideos(movieId);
      // Find the first trailer or teaser
      const video = data.results.find(
        (v) => v.type === "Trailer" || v.type === "Teaser"
      );
      return video;
    },
    enabled: false, // Don't fetch automatically
  });

  const onMouseEnter = useCallback(() => {
    setShowTrailer(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setShowTrailer(false);
  }, []);

  return {
    showTrailer,
    videoData,
    isLoadingVideo,
    handlers: {
      onMouseEnter,
      onMouseLeave,
    },
  };
}
