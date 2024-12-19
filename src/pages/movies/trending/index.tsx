import { useState } from "react";
// import { useNavigate } from "react-router-dom";
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
import { InfiniteData } from "@tanstack/react-query";
import { Movie } from "@/types/api.types";

interface MovieResponse {
  results: Movie[];
  nextPage: number | undefined;
  hasMore: boolean;
}

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState("week");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovies.useInfiniteMovies("trending", timeWindow) as {
      data?: InfiniteData<MovieResponse>;
      isLoading: boolean;
      fetchNextPage: () => void;
      hasNextPage: boolean | undefined;
      isFetchingNextPage: boolean;
    };
  // const navigate = useNavigate();

  // Flatten all pages of results into a single array
  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="min-h-screen pyn-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pb-8 pt-10">
        <div className="container">
          <h1 className="text-4xl font-bold">Trending Movies</h1>
          <p className="mt-2 text-muted-foreground">
            Discover what's popular right now
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b">
        <div className="container py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="flex items-center gap-4">
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
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasNextPage && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
