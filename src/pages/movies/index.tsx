import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { MovieCard } from "@/components/common/MovieCard";
import { MovieCardSkeleton } from "@/components/ui/skeletons";
import { useMovies } from "@/hooks/useMovies";
import { useGenres } from "@/hooks/useGenres";
import { InfiniteData } from "@tanstack/react-query";

const Movies = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    sort_by: "popularity.desc",
    with_genres: "",
    "vote_average.gte": 0,
    primary_release_year: new Date().getFullYear(),
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get search query from URL params
  const searchQuery = searchParams.get("search") || "";

  // Get genres
  const { data: genres } = useGenres();

  // Fetch movies using infinite query
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovies.useInfiniteDiscover(filters);

  // Flatten all pages of results into a single array
  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full bg-black/60">
        <div className="absolute inset-0">
          <img
            src="https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg"
            alt="Movies Banner"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative h-full container max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Discover Movies"}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Filters Section */}
          {!searchQuery && (
            <div className="py-8 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  <Select
                    value={filters.sort_by}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sort_by: value }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity.desc">
                        Most Popular
                      </SelectItem>
                      <SelectItem value="popularity.asc">
                        Least Popular
                      </SelectItem>
                      <SelectItem value="vote_average.desc">
                        Highest Rated
                      </SelectItem>
                      <SelectItem value="vote_average.asc">
                        Lowest Rated
                      </SelectItem>
                      <SelectItem value="release_date.desc">Newest</SelectItem>
                      <SelectItem value="release_date.asc">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  {/* Genre Filter */}
                  <Select
                    value={filters.with_genres}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, with_genres: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genres</SelectItem>
                      {genres?.map((genre) => (
                        <SelectItem key={genre.id} value={String(genre.id)}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year Filter */}
                  <Select
                    value={String(filters["primary_release_year"])}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        primary_release_year: value ? Number(value) : undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Years</SelectItem>
                      {[...Array(20)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Rating Filter */}
                  <Select
                    value={String(filters["vote_average.gte"])}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        "vote_average.gte": Number(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Minimum Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Ratings</SelectItem>
                      <SelectItem value="7">7+ Rating</SelectItem>
                      <SelectItem value="8">8+ Rating</SelectItem>
                      <SelectItem value="9">9+ Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoading
              ? [...Array(10)].map((_, i) => <MovieCardSkeleton key={i} />)
              : movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
          </div>

          {/* Load More */}
          {hasNextPage && !isLoading && (
            <div className="py-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More Movies"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Movies;
