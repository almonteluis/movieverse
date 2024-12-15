import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export function VideoPlayer({
  isOpen,
  onClose,
  videoId,
  title,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: "95vw",
    height: "90vh",
  });

  // Update dimensions based on screen size and orientation
  useEffect(() => {
    function updateDimensions() {
      const { innerWidth, innerHeight } = window;
      const isLandscape = innerWidth > innerHeight;
      const isMobile = innerWidth < 768;
      const isTablet = innerWidth >= 768 && innerWidth < 1024;

      if (isMobile) {
        if (isLandscape) {
          setDimensions({
            width: "95vw",
            height: "85vh",
          });
        } else {
          setDimensions({
            width: "100vw",
            height: "40vh",
          });
        }
      } else if (isTablet) {
        setDimensions({
          width: "90vw",
          height: "60vh",
        });
      } else {
        // Desktop
        setDimensions({
          width: "85vw",
          height: "80vh",
        });
      }
    }

    // Initial update
    updateDimensions();

    // Update on resize and orientation change
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          maxWidth: dimensions.width,
          maxHeight: dimensions.height,
        }}
        className="p-0 border-none bg-transparent shadow-none"
      >
        <div className="relative aspect-video w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${
              isPlaying ? "1" : "0"
            }&modestbranding=1&rel=0`}
            className="w-full h-full rounded-lg"
            allow="autoplay; fullscreen"
            allowFullScreen
          />

          {/* Floating Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
