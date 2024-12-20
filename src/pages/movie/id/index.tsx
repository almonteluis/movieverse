import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Star,
  Clock,
  Calendar,
  Users,
  MessageCircle,
} from "lucide-react";
import { VideoGallery } from "../../../components/features/VideoGallery";
import { tmdbService } from "../../../services/tmdbService";
import {
  useMovieData,
  useMovieCredits,
  useSimilarMovies,
  useMovieVideos,
} from "../../../hooks/useMovieDetails";
import { formatCurrency } from "../../../utils/formatters";
import { Movie, Cast, SimilarMovie } from "../../../types/api.types";

// Part of MovieDetail component
function HeroSection({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <section className="relative h-[70vh]">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${tmdbService.getImageUrl(movie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
        <div className="container mx-auto flex gap-8">
          {/* Poster */}
          <div className="hidden md:block w-64">
            <img
              src={tmdbService.getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white space-y-4">
            <h1 className="text-4xl font-bold">{movie.title || "Untitled"}</h1>

            <div className="flex items-center gap-6">
              {movie.vote_average && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{tmdbService.formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{tmdbService.formatDate(movie.release_date)}</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-white/20 text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="max-w-2xl text-lg text-gray-200">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CastSection({ cast }: { cast?: Cast[] }) {
  if (!cast?.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast.slice(0, 6).map((member) => (
          <div key={member.id} className="space-y-2">
            <div className="aspect-[2/3] rounded-lg bg-muted overflow-hidden">
              {member.profileUrl ? (
                <img
                  src={member.profileUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium line-clamp-1">{member.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {member.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimilarMoviesSection({ movies }: { movies: SimilarMovie[] }) {
  if (!movies?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Similar Movies</h2>
      <div className="space-y-4">
        {movies.slice(0, 6).map((movie) => (
          <div key={movie.id} className="flex gap-4">
            <div className="w-20 h-28 rounded-lg bg-muted overflow-hidden">
              <img
                src={tmdbService.getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium line-clamp-1">{movie.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id!, 10);

  if (isNaN(movieId)) {
    return <div>Invalid movie ID</div>;
  }

  const { movie, isLoading } = useMovieData(movieId);
  const { data: videos, isLoading: videosLoading } = useMovieVideos(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const cast = credits?.cast;
  const { data: similar } = useSimilarMovies(movieId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection movie={movie} />

      {/* Content Section */}
      <section className="container py-8 grid md:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>

          {/* Videos */}
          {videosLoading ? (
            <div>Loading videos...</div>
          ) : videos?.allVideos && videos.allVideos.length > 0 ? (
            <VideoGallery videos={videos.allVideos} movieTitle={movie.title} />
          ) : (
            <div>No videos available</div>
          )}

          {/* Cast */}
          <CastSection cast={cast} />

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              <Button variant="ghost">
                <MessageCircle className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">User Name</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1">4.5</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review content...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Similar Movies */}
          {similar && <SimilarMoviesSection movies={similar} />}

          {/* Movie Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd>Released</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Original Language
                </dt>
                <dd>English</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Budget</dt>
                <dd>{formatCurrency.withoutCents(movie.budget)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Revenue</dt>
                <dd>{formatCurrency.withoutCents(movie.revenue)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
