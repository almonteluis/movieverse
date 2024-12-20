import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api.service";

interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

interface VideoResponse {
  id: number;
  results: MovieVideo[];
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const { data } = await apiClient.get<VideoResponse>(`/movie/${movieId}/videos`);
      const videos = data.results;
      
      // Sort videos to prioritize official trailers
      return videos.sort((a, b) => {
        // Prioritize official content
        if (a.official !== b.official) {
          return a.official ? -1 : 1;
        }
        // Prioritize trailers
        if (a.type === "Trailer" && b.type !== "Trailer") {
          return -1;
        }
        if (a.type !== "Trailer" && b.type === "Trailer") {
          return 1;
        }
        // Sort by publish date
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });
    },
    enabled: Boolean(movieId),
  });
}
