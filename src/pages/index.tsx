import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/hooks/useMovies";
import { useGenres } from "@/hooks/useGenres";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  Search,
  PlayCircle,
  Star,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import {
  HeroSkeleton,
  MovieCardSkeleton,
  ComingSoonCardSkeleton,
  CategoryCardSkeleton,
} from "@/components/ui/skeletons";
import { tmdbApi } from "@/services/tmdb";

export default function HomePage() {
  const {
    data: nowPlaying,
    isLoading: isLoadingNowPlaying,
    isError: isNowPlayingError,
    error: nowPlayingError,
    refetch: refetchNowPlaying,
  } = useMovies.useNowPlaying();

  const {
    data: trending,
    isLoading: isLoadingTrending,
    isError: isTrendingError,
    error: trendingError,
    refetch: refetchTrending,
  } = useMovies.useTrending();

  const {
    data: upcoming,
    isLoading: isLoadingUpcoming,
    isError: isUpcomingError,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useMovies.useUpcoming();

  const { data: genres, isLoading: isLoadingGenres } = useGenres();

  // Get the first movie for the hero section
  const featuredMovie = nowPlaying?.[0] ?? {
    title: "Loading...",
    overview: "Loading...",
    backdrop_path: null,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}

      {isNowPlayingError ? (
        <ErrorMessage
          message="Failed to load featured movie"
          retry={refetchNowPlaying}
          className="h-[80vh]"
        />
      ) : isLoadingNowPlaying ? (
        <HeroSkeleton />
      ) : (
        <section className="relative h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={tmdbApi.getImageUrl(featuredMovie.backdrop_path, "original")}
              alt={featuredMovie.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full items-end">
            <div className="container pb-16">
              <h1 className="mb-4 text-5xl font-bold text-white">
                {featuredMovie.title}
              </h1>
              <p className="mb-6 max-w-2xl text-lg text-gray-200">
                {featuredMovie.description}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" /> Watch Now
                </Button>
                <Button size="lg" variant="secondary" className="gap-2">
                  <Plus className="h-5 w-5" /> Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="container py-8">
        <div className="relative">
          <input
            type="search"
            placeholder="Search for movies..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Categories</h2>
          <Button variant="ghost">View All</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="/api/placeholder/400/200"
              alt="Trending"
              className="h-48 w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Trending</span>
            </div>
          </Card>

          <Card className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="/api/placeholder/400/200"
              alt="Top Rated"
              className="h-48 w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <Star className="h-5 w-5" />
              <span className="font-semibold">Top Rated</span>
            </div>
          </Card>

          <Card className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="/api/placeholder/400/200"
              alt="New Releases"
              className="h-48 w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">New Releases</span>
            </div>
          </Card>

          <Card className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="/api/placeholder/400/200"
              alt="Watchlist"
              className="h-48 w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Watchlist</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Trending Movies</h2>
          <Button variant="ghost">See All</Button>
        </div>

        {isTrendingError ? (
          <ErrorMessage
            message="Failed to load trending movies"
            retry={refetchTrending}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoadingTrending
              ? [...Array(5)].map((_, i) => <MovieCardSkeleton key={i} />)
              : trending?.slice(0, 5).map((movie) => (
                  <Card key={movie.id} className="group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={tmdbApi.getImageUrl(movie.poster_path, "w500")}
                        alt={movie.title}
                        className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4">
                        <div className="flex items-center gap-2 text-white">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  </Card>
                ))}
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <Button variant="ghost">See All</Button>
        </div>

        {isUpcomingError ? (
          <ErrorMessage
            message="Failed to load upcoming movies"
            retry={refetchUpcoming}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingUpcoming
              ? [...Array(3)].map((_, i) => <ComingSoonCardSkeleton key={i} />)
              : upcoming?.slice(0, 3).map((movie) => (
                  <Card key={movie.id} className="flex overflow-hidden">
                    <img
                      src={tmdbApi.getImageUrl(movie.poster_path, "w342")}
                      alt={movie.title}
                      className="h-[200px] w-[133px] object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="mb-2 font-semibold">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {movie.overview}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button variant="secondary" size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        )}
      </section>
    </div>
  );
}
