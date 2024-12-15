import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, Play } from "lucide-react";
import { tmdbApi } from "@/services/tmdb";
import { useHoverTrailer } from "@/hooks/useHoverTrailer";
import { VideoPlayer } from "@/components/features/VideoPlayer";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const {
    showTrailer,
    videoData,
    isLoadingVideo,
    handlers: { onMouseEnter, onMouseLeave },
  } = useHoverTrailer(movie.id);

  // Handle card click without interfering with trailer button
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if not clicking the trailer button
    if (!e.defaultPrevented && onClick) {
      onClick();
    }
  };

  // Prevent navigation when clicking trailer button
  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <Card
        className="group relative overflow-hidden"
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
                onClick={() => setShowModal(true)}
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
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="space-y-1 p-4">
          <h3 className="line-clamp-1 font-semibold">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>2h 15m</span>
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
