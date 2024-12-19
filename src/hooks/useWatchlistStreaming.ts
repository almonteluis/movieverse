import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Movie, StreamingSource } from "../types/api.types";
import { watchmodeApi } from "../services/watchmode";

interface MovieWithStreaming extends Movie {
  streaming_sources: StreamingSource[];
}

interface CacheEntry {
  sources: StreamingSource[];
  timestamp: number;
}

interface StreamingCache {
  [movieId: number]: CacheEntry;
}

const CACHE_KEY = 'movieverse_streaming_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getCache = (): StreamingCache => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
};

const setCache = (cache: StreamingCache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save to cache:', error);
  }
};

const getCachedSources = (movieId: number): StreamingSource[] | null => {
  const cache = getCache();
  const entry = cache[movieId];
  
  if (!entry) return null;
  
  // Check if cache is expired
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    // Remove expired entry
    const newCache = { ...cache };
    delete newCache[movieId];
    setCache(newCache);
    return null;
  }
  
  // Only return cached sources if they're not empty
  return entry.sources.length > 0 ? entry.sources : null;
};

const setCachedSources = (movieId: number, sources: StreamingSource[]) => {
  // Only cache if we have actual sources
  if (!sources || sources.length === 0) return;
  
  const cache = getCache();
  cache[movieId] = {
    sources,
    timestamp: Date.now()
  };
  setCache(cache);
};

const fetchWithRetry = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();
      // Only consider it a success if we got actual sources
      if (result && Array.isArray(result) && result.length > 0) {
        return result;
      }
      // If we got an empty result, try again unless it's the last attempt
      if (attempt === maxRetries - 1) {
        throw new Error('No streaming sources found');
      }
    } catch (error: any) {
      lastError = error;
      // If we've hit the rate limit
      if (error?.response?.status === 429) {
        // On last attempt, throw the error
        if (attempt === maxRetries - 1) throw error;
        
        // Exponential backoff with jitter
        const backoffDelay = baseDelay * Math.pow(2, attempt) * (0.5 + Math.random());
        await delay(backoffDelay);
        continue;
      }
      // For other errors, throw immediately
      throw error;
    }
    // Add delay between attempts
    if (attempt < maxRetries - 1) {
      await delay(baseDelay);
    }
  }
  
  throw lastError;
};

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
        // Process movies in batches to avoid overwhelming the API
        const batchSize = 3;
        const results: MovieWithStreaming[] = [];
        let hasError = false;

        for (let i = 0; i < watchlist.length; i += batchSize) {
          const batch = watchlist.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (movie) => {
              try {
                // First check cache
                const cachedSources = getCachedSources(movie.id);
                if (cachedSources) {
                  return {
                    ...movie,
                    streaming_sources: cachedSources
                  } as MovieWithStreaming;
                }

                // If not in cache, fetch from API
                const sources = await fetchWithRetry(() => 
                  watchmodeApi.getStreamingInfoForMovie(movie.id)
                );

                // Only cache and use sources if we got actual data
                if (sources && sources.length > 0) {
                  setCachedSources(movie.id, sources);
                  return {
                    ...movie,
                    streaming_sources: sources,
                  };
                }
                
                // If no sources found, return movie without streaming sources
                return {
                  ...movie,
                  streaming_sources: [],
                };
              } catch (err: any) {
                hasError = true;
                console.error(`Error fetching streaming info for movie ${movie.id}:`, err);
                // Return movie without streaming sources on error
                return {
                  ...movie,
                  streaming_sources: [],
                };
              }
            })
          );
          results.push(...batchResults);

          // Add a small delay between batches only if we have more batches to process
          if (i + batchSize < watchlist.length) {
            await delay(1000);
          }
        }

        setMoviesWithStreaming(results);
        
        // Set error if any movie failed to fetch
        if (hasError) {
          setError("Some movies failed to load streaming information. Please try again later.");
        }
      } catch (err: any) {
        const message = err?.response?.status === 429 
          ? "Rate limit exceeded. Please try again in a few minutes."
          : "Failed to fetch streaming information";
        setError(message);
        console.error("Error fetching streaming info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingInfo();
  }, [watchlist]);

  // Group movies by streaming service, ensuring each movie appears only once per service
  const moviesByService = moviesWithStreaming.reduce(
    (acc, movie) => {
      if (!movie.streaming_sources?.length) {
        acc["Not Available"] = [...(acc["Not Available"] || []), movie];
        return acc;
      }

      // Get unique service names for this movie
      const uniqueServices = [...new Set(movie.streaming_sources.map(source => source.name))];
      
      // Add movie once per unique service
      uniqueServices.forEach((serviceName) => {
        // Only add the movie if it's not already in this service's array
        if (!acc[serviceName]?.some(m => m.id === movie.id)) {
          acc[serviceName] = [...(acc[serviceName] || []), movie];
        }
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
