import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { tmdbApi } from "../services/tmdb";
import { Movie } from "../types/api.types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await tmdbApi.movies.search(searchQuery);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search movies");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchMovies(debouncedQuery);
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
