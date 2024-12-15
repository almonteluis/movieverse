import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdb";

export function useHoverTrailer(movieId: number) {
  const [isHovering, setIsHovering] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const timerRef = useRef<number>();

  const { data: videos, isLoading: isLoadingVideo } = useQuery({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const { data } = await tmdbApi.movies.getVideos(movieId);
      // Find trailer or teaser
      return data.results.find(
        (video: any) => video.type === "Trailer" || video.type === "Teaser",
      );
    },
    enabled: isHovering, // Only fetch when hovering
  });

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    timerRef.current = window.setTimeout(() => {
      setShowTrailer(true);
    }, 2000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setShowTrailer(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isHovering,
    showTrailer,
    videoData: videos,
    isLoadingVideo,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
