import Banner from "./Blocks/Banner";
import FAQ from "./Blocks/FAQ";
import FeatureHorizontalCarousel from "./Blocks/FeatureCarousel";
import FeatureBlocks, { FeatureItem } from "./Blocks/Features";
import Pricing from "./Blocks/Pricing";
import VideoDisplay from "./Blocks/VideoDisplay";

import * as AntIcons from "react-icons/ai";
import {
  Accordion,
  Button,
  CardCarousel,
  ImageTextBlock,
  LogoCarousel,
} from "ssw-tinacms-landingkit";
import Container from "../Container";
import BentoBox from "./Blocks/BentoBox/BentoBox";
import CalculatorComponent from "./Blocks/Calculator";
import CallToAction from "./Blocks/CallToAction";
import CardAndImageParent from "./Blocks/CardAndImage/CardAndImage";
import ComparisonTable from "./Blocks/ComparisonTable";
import Hero from "./Blocks/Hero";
import { Timeline } from "./Blocks/Timeline/Timeline";

interface Block {
  __typename: string;
  title?: string | null;
  description?: string | null;
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

      case "PagesPageBlocksBentoBox":
        return <BentoBox data={block} />;

      case "PagesPageBlocksLogoCarousel":
        //@ts-expect-error typing issue with data
        return <LogoCarousel key={index} data={block} />;
      case "PagesPageBlocksCardCarousel":
        //@ts-expect-error typing issue with data
        return <CardCarousel icons={AntIcons} data={block} />;
      case "PagesPageBlocksButton":
        //@ts-expect-error typing issue with data
        return <Button icons={AntIcons} data={block} />;
      case "PagesPageBlocksImageTextBlock":
        //@ts-expect-error typing issue with data
        return <ImageTextBlock icons={AntIcons} data={block}></ImageTextBlock>;
      case "PagesPageBlocksAccordion":
        return (
          <Accordion
            callbackFunctions={null}
            icons={AntIcons}
            data={block}
          ></Accordion>
        );
      case "PagesPageBlocksTimeline":
        return <Timeline data={block} />;
      case "PagesPageBlocksCardAndImage":
        return <CardAndImageParent key={index} data={block} />;
      case "PagesPageBlocksComparisonTable":
        return <ComparisonTable data={block} />;
      case "PagesPageBlocksCalculator":
        return <CalculatorComponent data={block} />;
      case "PagesPageBlocksCallToAction":
        return (
          <Container className="w-full">
            <CallToAction className="w-full" {...block} />
          </Container>
        );
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
