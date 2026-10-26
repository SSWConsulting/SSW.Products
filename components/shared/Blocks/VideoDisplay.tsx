import Container from "../../Container";
import LinkableHeading from "../LinkableHeading";
import { YouTubeEmbed } from "../YouTubeEmbed";

interface VideoDisplayProps {
  data: {
    __typename: string;
    altText?: string | null;
    title?: string | null;
    externalVideoLink?: string | null;
    thumbnail?: string | null;
    figureCaption?: string | null;
  };
}

export default function VideoDisplay({ data }: VideoDisplayProps) {
  const { externalVideoLink, title, figureCaption } = data;

  return (
    <Container className="flex justify-center mx-auto container pb-16 md:pb-24">
      <div className="items-center w-full h-auto ">
        <LinkableHeading
          as="h2"
          className="pb-12 text-center"
        >
          {" "}
          {title}
        </LinkableHeading>
        <YouTubeEmbed
          className="w-full mx-auto"
          src={externalVideoLink || ""}
          placeholder={data.thumbnail || ""}
        />
        {figureCaption && (
          <p className="text-sm font-bold text-gray-300 mt-2 text-left">
            {figureCaption}
          </p>
        )}
      </div>
    </Container>
  );
}
