import { useNavigate } from "react-router-dom";
import { Movie } from "@/types/api.types";
import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { BookmarkPlus, BookmarkCheck, Info } from "lucide-react";
import { useStore } from "@/store";

interface MovieCardProps {
  movie: Movie;
  onWatchlistRemove?: () => void;
  isInWatchlist?: boolean;
}

export function MovieCard({ movie, onWatchlistRemove }: MovieCardProps) {
  const navigate = useNavigate();
  const watchlist = useStore((state) => state.watchlist);
  const addToWatchlist = useStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useStore((state) => state.removeFromWatchlist);

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
      onWatchlistRemove?.();
    } else {
      addToWatchlist(movie);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card
      className="relative group overflow-hidden cursor-pointer"
      onClick={handleCardClick}
      data-testid="movie-card"
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleWatchlistClick}
                className="rounded-full p-0"
                title={
                  isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
                }
              >
                {isInWatchlist ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <BookmarkPlus className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleInfoClick}
                className="rounded-full p-0"
                title="View details"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(movie.release_date).getFullYear()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
