import React, { useRef, useState, KeyboardEvent, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, Play, Plus, Share, Heart, Monitor } from "lucide-react";
import { tmdbApi } from "@/services/tmdb";
import { watchmodeApi } from "@/services/watchmode";
import { useHoverTrailer } from "@/hooks/useHoverTrailer";
import { VideoPlayer } from "@/components/features/VideoPlayer";
import { Movie, StreamingSource } from "@/types/api.types";
import { Skeleton } from "../ui/skeleton";

interface MovieCardProps {
  movie: Movie;
  onNavigate?: (movieId: number) => void;
}

export function MovieCard({ movie, onNavigate }: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [streamingSources, setStreamingSources] = useState<StreamingSource[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    showTrailer,
    videoData,
    handlers: { onMouseEnter, onMouseLeave },
  } = useHoverTrailer(movie.id);

  // Fetch streaming sources when component mounts
  useEffect(() => {
    const fetchStreamingSources = async () => {
      if (movie.title && movie.release_date) {
        const year = new Date(movie.release_date).getFullYear().toString();
        const sources = await watchmodeApi.getStreamingInfoForMovie(movie.title, year);
        setStreamingSources(sources);
      }
    };
    fetchStreamingSources();
  }, [movie.title, movie.release_date]);

  // Handle card click without interfering with trailer button
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on an action button, video player, or streaming link, don't navigate
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".video-player") ||
      (e.target as HTMLElement).closest("a")
    ) {
      e.stopPropagation();
      return;
    }

    // Otherwise, navigate to the movie detail page
    onNavigate?.(movie.id);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNavigate?.(movie.id);
    }
  };

  // Share functionality
  const handleShare = async () => {
    try {
      await navigator.share({
        title: movie.title,
        text: movie.overview || `Check out ${movie.title}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Toggle favorite/watchlist
  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const toggleWatchlist = () => setIsWatchlist(!isWatchlist);

  // Get platform icon
  const getPlatformIcon = (name: string) => {
    const iconMap: { [key: string]: string } = {
      'Netflix': '/netflix-icon.png',
      'Hulu': '/hulu-icon.png',
      'Max': '/max-icon.png',
      'Prime Video': '/prime-icon.png',
      'Disney+': '/disney-icon.png',
      'Apple TV+': '/apple-tv-icon.png'
    };
    return iconMap[name] || null;
  };

  return (
    <>
      <Card
        ref={cardRef}
        className="group relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${movie.title}`}
      >
        <div className="relative">
          {/* Loading Skeleton */}
          {!isImageLoaded && (
            <Skeleton className="h-[300px] w-full" />
          )}

          {/* Movie Poster */}
          <img
            src={
              movie.poster_path
                ? tmdbApi.getImageUrl(movie.poster_path, "w500")
                : "/placeholder-poster.png"
            }
            alt={movie.title || ""}
            className={`h-[300px] w-full object-cover transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70"
              onClick={toggleWatchlist}
              aria-label={isWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Plus className={`h-4 w-4 ${isWatchlist ? "text-primary" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70"
              onClick={handleShare}
              aria-label="Share movie"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {/* Trailer Overlay */}
          {showTrailer && videoData && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-300">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-white/10 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                <Play className="h-5 w-5" />
                Play Trailer
              </Button>
            </div>
          )}

          {/* Rating Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
            <div className="flex items-center gap-2 text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="space-y-1 p-4">
          <h3 className="line-clamp-1 font-semibold">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {movie.release_date && new Date(movie.release_date).getFullYear()}
            </span>
            {movie.runtime && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{tmdbApi.formatRuntime(movie.runtime)}</span>
              </>
            )}
          </div>

          {/* Streaming Platforms */}
          {streamingSources.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Monitor className="h-4 w-4" />
                <span>Available on:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {streamingSources.map((source) => (
                  <a
                    key={source.source_id}
                    href={source.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {getPlatformIcon(source.name) ? (
                      <img
                        src={getPlatformIcon(source.name)}
                        alt={source.name}
                        className="w-4 h-4"
                      />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )}
                    <span className="text-xs">{source.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Video Modal */}
      {videoData && (
        <VideoPlayer
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          videoId={videoData.key}
          title={movie.title}
        />
      )}
    </>
  );
}
