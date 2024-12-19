import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Movie, StreamingSource } from "../types/api.types";
import { watchmodeApi } from "../services/watchmode";

interface MovieWithStreaming extends Movie {
  streaming_sources: StreamingSource[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  fn: () => Promise<any>,
  maxRetries = 3
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error: any) {
      lastError = error;
      // If we've hit the rate limit
      if (error?.response?.status === 429) {
        // If we've exceeded daily quota, no point in retrying
        if (error.rateLimitInfo?.quotaUsed >= error.rateLimitInfo?.quotaTotal) {
          throw error;
        }
        
        // On last attempt, throw the error
        if (attempt === maxRetries - 1) throw error;
        
        // Use the retry delay from the API response
        const retryDelay = (error.rateLimitInfo?.retryAfter || 60) * 1000;
        await delay(retryDelay);
        continue;
      }
      // For other errors, throw immediately
      throw error;
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
      if (!watchlist.length) {
        setMoviesWithStreaming([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Check rate limit status before starting
        const initialStatus = await watchmodeApi.checkRateLimit();
        if (initialStatus.quotaUsed >= initialStatus.quotaTotal) {
          throw { 
            response: { status: 429 },
            rateLimitInfo: initialStatus,
            message: "Daily API quota exceeded. Please try again tomorrow."
          };
        }

        // Calculate optimal batch size based on remaining requests
        const safeRemainingRequests = Math.max(initialStatus.remaining - 5, 1); // Leave buffer
        const estimatedRequestsPerMovie = 2; // One for search, one for sources
        const batchSize = Math.max(
          1,
          Math.min(
            Math.floor(safeRemainingRequests / estimatedRequestsPerMovie),
            3 // Never process more than 3 at once
          )
        );

        const results: MovieWithStreaming[] = [];
        let hasError = false;

        for (let i = 0; i < watchlist.length; i += batchSize) {
          const batch = watchlist.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (movie) => {
              try {
                const sources = await fetchWithRetry(() => 
                  watchmodeApi.getStreamingInfoForMovie(movie.id)
                );

                return {
                  ...movie,
                  streaming_sources: sources,
                };
              } catch (err: any) {
                hasError = true;
                console.error(`Error fetching streaming info for movie ${movie.id}:`, err);
                // If we hit the daily quota limit, stop processing
                if (err.rateLimitInfo?.quotaUsed >= err.rateLimitInfo?.quotaTotal) {
                  throw err;
                }
                return {
                  ...movie,
                  streaming_sources: [],
                };
              }
            })
          );
          results.push(...batchResults);

          // Add a small delay between batches if there are more to process
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
        let message = "Failed to fetch streaming information";
        
        if (err?.response?.status === 429) {
          const rateLimitInfo = err.rateLimitInfo;
          if (rateLimitInfo?.quotaUsed >= rateLimitInfo?.quotaTotal) {
            message = "Daily API quota exceeded. Please try again tomorrow.";
          } else {
            message = `Rate limit exceeded. Please try again in ${rateLimitInfo?.retryAfter || 60} seconds.`;
          }
        }
        
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
