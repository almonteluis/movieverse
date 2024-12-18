import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Star,
  ChevronRight,
} from "lucide-react";

const Movies = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full bg-black/60">
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/1080"
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
            <div className="relative">
              <Input
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
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
              <Select defaultValue="trending">
                <option value="trending">Trending</option>
                <option value="popular">Popular</option>
                <option value="topRated">Top Rated</option>
                <option value="upcoming">Upcoming</option>
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
            {[...Array(10)].map((_, i) => (
              <div key={i} className="group relative">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                  <img
                    src="/api/placeholder/300/450"
                    alt="Movie poster"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="font-medium line-clamp-1 group-hover:text-primary">
                    Movie Title
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      4.5
                    </span>
                    <span>2024</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="py-8 text-center">
            <Button variant="outline">Load More Movies</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Movies;
