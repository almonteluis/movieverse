import axios from "axios";

const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = "https://api.watchmode.com/v1";
const CACHE_KEY = "movieverse_watchmode_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface WatchmodeCache {
  [tmdbId: number]: {
    titleId?: number;
    sources: StreamingInfo[];
    timestamp: number;
  };
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  retryAfter: number;
  quotaTotal: number;
  quotaUsed: number;
}

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

const getCache = (): WatchmodeCache => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
};

const setCache = (cache: WatchmodeCache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("Failed to save to watchmode cache:", error);
  }
};

const getCachedData = (tmdbId: number) => {
  const cache = getCache();
  const entry = cache[tmdbId];

  if (!entry) return null;

  // Check if cache is expired
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    // Remove expired entry
    const newCache = { ...cache };
    delete newCache[tmdbId];
    setCache(newCache);
    return null;
  }

  return entry;
};

const setCachedData = (
  tmdbId: number,
  data: { titleId?: number; sources: StreamingInfo[] },
) => {
  const cache = getCache();
  cache[tmdbId] = {
    ...data,
    timestamp: Date.now(),
  };
  setCache(cache);
};

// Extract rate limit info from response headers
const getRateLimitInfo = (headers: any): RateLimitInfo => ({
  limit: parseInt(headers["x-ratelimit-limit"] || "120", 10),
  remaining: parseInt(headers["x-ratelimit-remaining"] || "0", 10),
  retryAfter: parseInt(headers["retry-after"] || "60", 10),
  quotaTotal: parseInt(headers["x-account-quota"] || "1000", 10),
  quotaUsed: parseInt(headers["x-account-quota-used"] || "0", 10),
});

export const watchmodeApi = {
  // Get streaming sources for a title
  getStreamingSources: async (titleId: number): Promise<StreamingInfo[]> => {
    try {
      const response = await axiosInstance.get(`/title/${titleId}/sources/`);

      // Extract rate limit info even from successful responses
      const rateLimitInfo = getRateLimitInfo(response.headers);

      // Filter to include only subscription and free services
      return response.data.filter(
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
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const rateLimitInfo = getRateLimitInfo(error.response.headers);
        throw {
          ...error,
          rateLimitInfo,
          message:
            rateLimitInfo.quotaUsed >= rateLimitInfo.quotaTotal
              ? "Daily API quota exceeded. Please try again tomorrow."
              : "Rate limit exceeded. Please try again later.",
        };
      }
      console.error("Error fetching streaming sources:", error);
      return [];
    }
  },

  // Get streaming info for a movie with caching and rate limit handling
  getStreamingInfoForMovie: async (
    tmdbId: number,
  ): Promise<StreamingInfo[]> => {
    try {
      // Check cache first
      const cachedData = getCachedData(tmdbId);
      if (cachedData?.sources) {
        return cachedData.sources;
      }

      // If we have a cached titleId but no sources, try to fetch sources
      if (cachedData?.titleId) {
        const sources = await watchmodeApi.getStreamingSources(
          cachedData.titleId,
        );
        if (sources.length > 0) {
          setCachedData(tmdbId, { titleId: cachedData.titleId, sources });
          return sources;
        }
      }

      // Search for title ID
      const searchResponse = await axiosInstance.get<WatchmodeSearchResult>(
        "/search",
        {
          params: {
            search_field: "tmdb_movie_id",
            search_value: tmdbId,
            types: "movie",
          },
        },
      );

      const titleId = searchResponse.data.title_results?.[0]?.id;
      if (!titleId) {
        setCachedData(tmdbId, { sources: [] });
        return [];
      }

      // Cache the titleId even if we don't get sources
      setCachedData(tmdbId, { titleId, sources: [] });

      // Get streaming sources
      const sources = await watchmodeApi.getStreamingSources(titleId);

      // Only cache if we got actual sources
      if (sources.length > 0) {
        setCachedData(tmdbId, { titleId, sources });
      }

      return sources;
    } catch (error: any) {
      if (error?.response?.status === 429) {
        const rateLimitInfo = getRateLimitInfo(error.response.headers);
        throw {
          ...error,
          rateLimitInfo,
          message:
            rateLimitInfo.quotaUsed >= rateLimitInfo.quotaTotal
              ? "Daily API quota exceeded. Please try again tomorrow."
              : "Rate limit exceeded. Please try again later.",
        };
      }
      console.error("Error fetching streaming info:", error);
      return [];
    }
  },

  // Check current rate limit status
  checkRateLimit: async (): Promise<RateLimitInfo> => {
    try {
      const response = await axiosInstance.get("/status/");
      return getRateLimitInfo(response.headers);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        return getRateLimitInfo(error.response.headers);
      }
      throw error;
    }
  },
};
