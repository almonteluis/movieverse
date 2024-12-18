import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";
import { tmdbApi } from "../../services/tmdb";
import { useNavigate } from "react-router-dom";

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery, results, isLoading } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for movies..."
          className="w-full rounded-lg border border-border bg-background px-4 py-3 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (query || isLoading) && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-[70vh] divide-y divide-border overflow-auto">
              {results.map((movie) => (
                <li key={movie.id}>
                  <button
                    onClick={() => handleMovieClick(movie.id)}
                    className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted/50"
                  >
                    {movie.poster_path ? (
                      <img
                        src={tmdbApi.getImageUrl(movie.poster_path, "w92")}
                        alt={movie.title}
                        className="h-24 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-16 items-center justify-center rounded bg-muted">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h4 className="mb-1 font-medium line-clamp-1">
                        {movie.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "Release date unknown"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {movie.overview || "No overview available"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-muted-foreground">
              No movies found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
