import { ComponentProps } from "react";
import LinkableHeading from "../LinkableHeading";
import HeadingSpecimen from "./HeadingSpecimen";
import ImageGrid from "./ImageGrid";

type ImageGridProps = ComponentProps<typeof ImageGrid>;

interface TypographySectionProps {
  /** The Tina "Fonts" imageGrid block, rendered as the first sub-section. */
  fonts: ImageGridProps;
}

const DESCRIPTION =
  "Everything type on YakShaver: the typefaces we set it in, and the heading scale that uses them.";

// Typography is one section on /media with two sub-sections, so the brand kit
// reads as a single subject instead of two neighbours that happen to be about
// type. The h2 and the "Headings" half are rendered from code; "Fonts" keeps
// its Tina-authored title, now as the h3 it always should have been.
export default function TypographySection({ fonts }: TypographySectionProps) {
  return (
    <section>
      <div className="pt-8 px-4 mx-auto w-full max-w-300 md:px-12 sm:px-8 medium:px-0">
        <div className="text-center">
          <LinkableHeading as="h2" className="mb-1">
            Typography
          </LinkableHeading>
          <p className="text-[14px] text-white font-medium leading-relaxed max-w-3xl mx-auto">
            {DESCRIPTION}
          </p>
        </div>
      </div>

      <ImageGrid {...fonts} headingLevel="h3" />
      <HeadingSpecimen headingLevel="h3" />
    </section>
  );
}
