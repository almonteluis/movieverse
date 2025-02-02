import { Play } from "lucide-react";
type ThumbnailProps = {
  src: string;
  alt: string;
};

export default function VideoThumbnail({ src, alt }: ThumbnailProps) {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <img
        src={`https://img.youtube.com/vi/${src}/maxresdefault.jpg`}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12" />
      </div>
    </div>
  );
}
