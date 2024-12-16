import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieCardSkeleton } from "@/components/ui/skeletons";
import { useMovies } from "@/hooks/useMovies";
import { Filter } from "lucide-react";
import { MovieCard } from "@/components/common/MovieCard";

// Replace the existing card mapping with:

export default function UpcomingPage() {
  const { data: upcoming, isLoading } = useMovies.useUpcoming();

  const [timeWindow, setTimeWindow] = useState("week");
  const navigate = useNavigate(); // Add this hook
  const [filter, setFilter] = useState({
    timeWindow: "week",
    sortBy: "popularity",
    genre: "all",
  });

  // Handler for card click
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen pyn-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pb-8 pt-10">
        <div className="container">
          <h1 className="text-4xl font-bold">Upcoming Movies</h1>
          <p className="mt-2 text-muted-foreground">
            Discover what popular right now
          </p>
        </div>
      </div>

      <div className="flex flex-row">
        {/* Filters Section */}
        <div className="border-b w-1/5">
          <div className="container py-4">
            <div className="flex flex-row gap-4 sm:flex-col sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={timeWindow === "day" ? "default" : "outline"}
                  onClick={() => setTimeWindow("day")}
                >
                  Today
                </Button>
                <Button
                  variant={timeWindow === "week" ? "default" : "outline"}
                  onClick={() => setTimeWindow("week")}
                >
                  This Week
                </Button>
              </div>

              <div className="flex flex-col items-start gap-4">
                <Select defaultValue="popularity">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="vote_average">Rating</SelectItem>
                    <SelectItem value="release_date">Release Date</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="container py-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {upcoming?.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
