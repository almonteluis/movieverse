import axios from "axios";

const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = "https://api.watchmode.com/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: WATCHMODE_API_KEY,
  },
});

export interface StreamingInfo {
  source_id: number;
  name: string;
  type: string;
  region: string;
  web_url: string;
  ios_url?: string;
  android_url?: string;
  format: string;
  price?: number;
  seasons?: number;
  episodes?: number;
}

interface WatchmodeSearchResult {
  title_results: Array<{
    id: number;
    name: string;
    type: string;
    year: number;
    imdb_id: string;
    tmdb_id: number;
    tmdb_type: string;
  }>;
}

export const watchmodeApi = {
  // Search for a title using TMDB ID
  getTitleIdByTmdbId: async (tmdbId: number) => {
    try {
      const { data } = await axiosInstance.get<WatchmodeSearchResult>(
        "/search",
        {
          params: {
            search_field: "tmdb_movie_id",
            search_value: tmdbId,
            types: "movie",
          },
        },
      );
      return data.title_results?.[0]?.id;
    } catch (error) {
      console.error("Error searching title:", error);
      return null;
    }
  },

  // Get streaming sources for a title
  getStreamingSources: async (titleId: number): Promise<StreamingInfo[]> => {
    try {
      const { data } = await axiosInstance.get(`/title/${titleId}/sources/`);
      // Filter to include only subscription and free services
      return data.filter(
        (source: StreamingInfo) =>
          ["sub", "free"].includes(source.type) &&
          [
            "Netflix",
            "Hulu",
            "Max",
            "Prime Video",
            "Disney+",
            "Apple TV+",
          ].includes(source.name),
      );
    } catch (error) {
      console.error("Error fetching streaming sources:", error);
      return [];
    }
  },

  // Combine search and sources into one convenient method
  getStreamingInfoForMovie: async (tmdbId: number) => {
    const titleId = await watchmodeApi.getTitleIdByTmdbId(tmdbId);
    if (!titleId) return [];
    return watchmodeApi.getStreamingSources(titleId);
  },
};
