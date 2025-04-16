import { YouTubeEmbed } from "../YouTubeEmbed";

interface VideoDisplayProps {
  data: {
    __typename: string;
    altText?: string | null;
    title?: string | null;
    externalVideoLink?: string | null;
  };
}

export default function VideoDisplay({ data }: VideoDisplayProps) {
  const { externalVideoLink, title } = data;

  return (
    <div className="flex justify-center mx-auto container">
      <div className="items-center w-full h-auto ">
        <h2 className="text-3xl text-white font-semibold pb-12 text-center">
          {" "}
          {title}
        </h2>
        <YouTubeEmbed
          className="w-full aspect-video mx-auto"
          src={externalVideoLink || ""}
        />
      </div>
    </div>
  );
}
