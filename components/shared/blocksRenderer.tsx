import type { RichText as RichTextProps } from "@/types/components/rich-text";
import Banner from "./Blocks/Banner";
import BentoBox from "./Blocks/BentoBox/BentoBox";
import CalculatorComponent from "./Blocks/Calculator";
import CallToAction from "./Blocks/CallToAction";
import CardAndImageParent from "./Blocks/CardAndImage/CardAndImage";
import ComparisonTable from "./Blocks/ComparisonTable";
import FAQ from "./Blocks/FAQ";
import FeatureHorizontalCarousel from "./Blocks/FeatureCarousel";
import FeatureBlocks, { FeatureItem } from "./Blocks/Features";
import Hero from "./Blocks/Hero/Hero";
import ImageGrid from "./Blocks/ImageGrid";
import ImageShowcase from "./Blocks/ImageShowcase";
import MediaHero from "./Blocks/MediaHero";
import Pricing from "./Blocks/Pricing";
import RichText from "./Blocks/RichText";
import { Timeline } from "./Blocks/Timeline/Timeline";
import { TryItNow } from "./Blocks/TryItNow";
import { DownloadCards, type DownloadCardsProps } from "./Blocks/DownloadCards";
import VideoDisplay from "./Blocks/VideoDisplay";

interface Block {
  __typename: string;
  title?: string | null;
  description?: string | null;
  gridDescription?: string | null;
  allPlans?: { title: string | null }[] | null;
  plans?: Plan[] | null;
  featureItem?: null | FeatureItem[];
}

interface Plan {
  planTier: string | null;
  planDescription: string | null;
  price: string | null;
  subPriceText: string | null;
  actions: PlanActions | null;
}

interface PlanActions {
  label: string | null;
  url: string | null;
  variant?: string | null;
  size?: string | null;
}

interface BlocksProps {
  blocks: Block[] | null;
}

const Blocks = ({ blocks }: BlocksProps) => {
  if (!blocks) return null;

  return blocks.map((block: Block, index: number) => {
    switch (block.__typename) {
      case "PagesPageBlocksFeatures":
        if (block.featureItem) {
          return (
            <FeatureBlocks
              key={index}
              data={{
                featureItem: block.featureItem,
              }}
              index={index}
            />
          );
        }
        return null;
      //TODO: remove ts-expect error https://github.com/SSWConsulting/SSW.Products/issues/15
      case "PagesPageBlocksFaq":
        // @ts-expect-error investigate after
        return <FAQ key={index} data={block} index={index} />;
      case "PagesPageBlocksFeatureCarousel":
        return (
          // @ts-expect-error investigate after
          <FeatureHorizontalCarousel key={index} data={block} index={index} />
        );
      case "PagesPageBlocksHero":
        return <Hero key={index} data={block} />;
      case "PagesPageBlocksPricing":
        // @ts-expect-error typing issue with data
        return <Pricing key={index} data={block} />;
      case "PagesPageBlocksBanner":
        // @ts-expect-error typing issue with data
        return <Banner key={index} data={block} />;
      case "PagesPageBlocksVideoDisplay":
        return <VideoDisplay key={index} data={block} />;
      case "PagesPageBlocksRichText":
        return <RichText key={index} {...(block as RichTextProps)} />;
      case "PagesPageBlocksBentoBox":
        return <BentoBox data={block} />;
      case "PagesPageBlocksTimeline":
        return <Timeline data={block} />;
      case "PagesPageBlocksCardAndImage":
        return <CardAndImageParent key={index} {...block} />;
      case "PagesPageBlocksComparisonTable":
        return <ComparisonTable data={block} />;
      case "PagesPageBlocksCalculator":
        return <CalculatorComponent data={block} />;
      case "PagesPageBlocksCallToAction":
        return <CallToAction className="w-full" {...block} />;

      case "PagesPageBlocksTryItNow":
        return <TryItNow {...block} />;
      case "PagesPageBlocksDownloadCards":
        return <DownloadCards {...(block as DownloadCardsProps)} />;
      case "PagesPageBlocksMediaHero":
        return <MediaHero key={index} {...block} />;
      case "PagesPageBlocksImageGrid":
        return <ImageGrid key={index} {...block} />;
      case "PagesPageBlocksImageShowcase":
        return <ImageShowcase key={index} {...block} />;
      default:
        return null;
    }
  });
};

interface BlocksRendererProps {
  data: {
    pageBlocks: Block[] | null;
  };
}

export const blocksRenderer = ({ data }: BlocksRendererProps) => {
  return <Blocks blocks={data.pageBlocks} />;
};
