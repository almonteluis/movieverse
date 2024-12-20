import { Play } from "lucide-react";
import { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";

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
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                alt={video.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12" />
              </div>
            </div>
            
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
