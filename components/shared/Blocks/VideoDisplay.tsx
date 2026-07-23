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
    <Container className="flex justify-center mx-auto container">
      <div className="items-center w-full h-auto ">
        <LinkableHeading
          as="h2"
          wrap
          className="text-3xl text-white font-semibold pb-12 text-center"
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
          <p className="text-sm text-gray-400 mt-2 text-left">
            {figureCaption}
          </p>
        )}
      </div>
    </Container>
  );
}
