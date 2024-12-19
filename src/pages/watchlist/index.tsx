import { useStore } from "@/store";
import { MovieCard } from "@/components/common/MovieCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Watchlist = () => {
  const watchlist = useStore((state) => state.watchlist);
  const clearWatchlist = useStore((state) => state.clearWatchlist);

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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatchlistRemove={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
