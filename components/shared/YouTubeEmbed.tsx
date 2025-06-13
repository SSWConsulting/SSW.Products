import { cn } from "@/lib/utils";
import { getYouTubeVideoId } from "@utils/youtube";
import Image from "next/image";
import React from "react";
import { FaPlay } from "react-icons/fa6";

type YouTubeEmbedProps = {
  src?: string;
  placeholder?: string;
  className?: string;
};

export const YouTubeEmbed = ({
  src,
  className,
  placeholder,
}: YouTubeEmbedProps) => {
  const videoId = getYouTubeVideoId(src);
  const [clicked, setClicked] = React.useState(false);
  return (
    <div className={cn("relative aspect-video w-full", className)}>
      {!clicked ? (
        <div className="bg-black group aspect-video  relative rounded-lg **:duration-200">
          <div className="p-5 inline-flex group-hover:scale-115 items-center justify-center absolute  rounded-full top-1/2 left-1/2 border-gradient-pink -translate-x-1/2 border-gradient-foreground-gray-darkest -translate-y-1/2 z-20">
            <FaPlay
              className="text-white pl-1 transition-transform ease-out md:text-7xl text-5xl cursor-pointer"
              onClick={() => setClicked(true)}
            />
          </div>
          <Image
            src={
              placeholder ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'><rect width='100%' height='100%' fill='%23999'/></svg>"
            }
            alt="YouTube video placeholder"
            fill
            className="w-full object-cover group-hover:brightness-70 transition-all inset-0 h-auto mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] rounded-lg cursor-pointer"
            onClick={() => setClicked(true)}
          />
        </div>
      ) : (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};
