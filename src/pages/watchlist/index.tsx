import { useStore } from "../../store";
import { MovieCard } from "../../components/organisms/MovieCard";
import { Button } from "../../components/atoms/button";
import { Trash2, Loader2 } from "lucide-react";
import { useWatchlistStreaming } from "../../hooks/useWatchlistStreaming";
import { Movie } from "../../types/api.types";

const StreamingServiceSection = ({
  name,
  movies,
  iconPath,
}: {
  name: string;
  movies: Movie[];
  iconPath?: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      {iconPath && (
        <img src={iconPath} alt={name} className="w-6 h-6 object-contain" />
      )}
      <h2 className="text-xl font-semibold">{name}</h2>
      <span className="text-sm text-gray-500">({movies.length})</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={`${name}-${movie.id}`} // Make key unique per streaming service
          movie={movie}
          onWatchlistRemove={() => {}}
        />
      ))}
    </div>
  </div>
);

const Watchlist = () => {
  const watchlist = useStore((state) => state.watchlist);
  const clearWatchlist = useStore((state) => state.clearWatchlist);
  const { loading, error, moviesByService } = useWatchlistStreaming();

  // Map of streaming service names to their icon paths
  const streamingIcons: Record<string, string> = {
    Netflix: "/netflix-icon.png",
    Hulu: "/hulu-icon.png",
    "Prime Video": "/prime-icon.png",
    Max: "/max-icon.png",
    "Disney+": "/disney-icon.png",
    "Apple TV+": "/apple-tv-icon.png",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        {watchlist.length > 0 && (
          <Button
            variant="secondary"
            onClick={clearWatchlist}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 className="w-4 h-4" />
            Clear Watchlist
          </Button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Your watchlist is empty</p>
          <p className="text-gray-400 mt-2">
            Start adding movies to keep track of what you want to watch!
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Fetching streaming information...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="space-y-8">
          {/* Display available streaming services first */}
          {Object.entries(moviesByService)
            .sort(([a], [b]) => {
              if (a === "Not Available") return 1;
              if (b === "Not Available") return -1;
              return a.localeCompare(b);
            })
            .map(([service, movies]) => (
              <StreamingServiceSection
                key={service}
                name={service}
                movies={movies}
                iconPath={streamingIcons[service]}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
