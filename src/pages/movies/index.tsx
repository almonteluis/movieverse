import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Filter, TrendingUp, Calendar } from "lucide-react";
import { MovieCard } from "@/components/common/MovieCard";
import { tmdbApi } from "@/services/tmdb";
import { Movie } from "@/types/api.types";

const Movies = () => {
  // const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies based on sort option and search query
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery) {
          data = await tmdbApi.movies.search(searchQuery, page);
          setMovies((prev) =>
            page === 1 ? data.results : [...prev, ...data.results],
          );
          setHasMore(page < data.total_pages);
        } else {
          data = await tmdbApi.movies.fetchMovies(
            sortBy === "trending"
              ? "trending"
              : sortBy === "popular"
                ? "now_playing"
                : sortBy === "topRated"
                  ? "top_rated"
                  : "upcoming",
            page,
          );
          setMovies((prev) =>
            page === 1 ? data.results : [...prev, ...data.results],
          );
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [sortBy, searchQuery, page]);

  // Reset page when changing sort or search
  useEffect(() => {
    setPage(1);
  }, [sortBy, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    setSearchQuery(input.value);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
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
            Discover Movies
          </h1>
          <div className="max-w-xl w-full">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  placeholder="Search movies..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Filters Section */}
          <div className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="topRated">Top Rated</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Trending
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Latest
              </span>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="py-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Movies"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Movies;
