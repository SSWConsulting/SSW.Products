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
    <div className="flex justify-center mx-auto">
      <div className="items-center w-1/2 h-auto">
        <h2 className="text-2xl  text-white font-semibold py-4 text-center">
          {" "}
          {title}
        </h2>
        <YouTubeEmbed src={externalVideoLink || ""} />
      </div>
    </div>
  );
}
