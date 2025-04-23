import { cn } from "@/lib/utils";

type YouTubeEmbedProps = {
  src: string;
  className?: string;
};

export const YouTubeEmbed = ({ src, className }: YouTubeEmbedProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
