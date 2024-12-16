import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, Play } from "lucide-react";
import { tmdbApi } from "@/services/tmdb";
import { useHoverTrailer } from "@/hooks/useHoverTrailer";
import { VideoPlayer } from "@/components/features/VideoPlayer";
import { Movie } from "@/types/api.types";

interface MovieCardProps {
  movie: Movie;
  onNavigate?: (movieId: number) => void;
}

export function MovieCard({ movie, onNavigate }: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    showTrailer,
    videoData,
    // isLoadingVideo,
    handlers: { onMouseEnter, onMouseLeave },
  } = useHoverTrailer(movie.id);

  // Handle card click without interfering with trailer button
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on the button or video player, don't navigate
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".video-player")
    ) {
      e.stopPropagation();
      return;
    }

    // Otherwise, navigate to the movie detail page
    onNavigate?.(movie.id);
  };

  return (
    <>
      <Card
        ref={cardRef}
        className="group relative overflow-hidden cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleCardClick}
      >
        <div className="relative">
          {/* Movie Poster */}
          <img
            src={tmdbApi.getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="aspect-[2/3] h-full w-full object-cover"
          />

          {/* Hover Overlay */}
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
