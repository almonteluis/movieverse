import { useState } from "react";
import { VideoPlayer } from "../molecules/VideoPlayer";
import VideoThumbnail from "../atoms/VideoThumbnail";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

interface VideoGalleryProps {
  videos: Video[];
  movieTitle: string;
}

export function VideoGallery({ videos, movieTitle }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!videos?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            {/* YouTube Thumbnail */}
            <VideoThumbnail src={video.key} alt={video.name} />

            {/* Video Info */}
            <div className="mt-2">
              <h3 className="font-medium line-clamp-1" title={video.name}>
                {video.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="capitalize">{video.type}</span>
                {video.official && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    Official
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          isOpen={Boolean(selectedVideo)}
          onClose={() => setSelectedVideo(null)}
          videoId={selectedVideo.key}
          title={`${movieTitle} - ${selectedVideo.name}`}
        />
      )}
    </div>
  );
}
