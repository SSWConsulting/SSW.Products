import { Collection, TinaField } from "tinacms";
import { FeaturesTemplate } from "../../components/shared/Blocks/Features.template";
import { FAQTemplate } from "../../components/shared/Blocks/FAQ.template";
import { CarouselFeatureTemplate } from "../../components/shared/Blocks/FeatureCarousel.template";
import { pricingTemplate } from "../../components/shared/Blocks/Pricing.template";
import { BannerTemplate } from "../../components/shared/Blocks/Banner.template";
import { videoDisplayTemplate } from "../../components/shared/Blocks/VideoDisplay.template";

import { bentoBoxTemplate } from "../../components/shared/Blocks/BentoBox.template";
import { HeroTemplate } from "../../components/shared/Blocks/Hero.template";
import { timelineTemplate } from "../../components/shared/Blocks/Timeline/Timeline.template";

import {
  breadcrumbBlock,
  buttonBlock,
  cardCarouselBlock,
  imageTextBlock,
  logoCarouselBlock,
  accordionBlock,
  // replace this with a relative path node modules directory (See known issues)
} from "../../node_modules/ssw-tinacms-landingkit/dist";
import * as AntIcons from "../../node_modules/react-icons/ai";
import { seoInformation } from "../shared/SEOInformation";


export const PagesSchema: Collection = {
  label: "Product Pages",
  name: "pages",
  path: "content/pages/",
  format: "json",
  //This ui is needed because of the dynamic routing with [filename] -> tina is looking for a static path (i.e pages/TimePro, pages/YakShaver)
  // ui: {
  //   router: ({ document }) => {
  //     return `/${document?._sys.filename}`;
  //   },
  // },
  fields: [
    seoInformation as TinaField,
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "object",
      name: "pageBlocks",
      label: "Page Blocks",
      list: true,
      ui: {
        visualSelector: true,
      },
      templates: [
        HeroTemplate,
        FeaturesTemplate,
        FAQTemplate,
        CarouselFeatureTemplate,
        pricingTemplate,
        BannerTemplate,
        videoDisplayTemplate,
        bentoBoxTemplate,
        timelineTemplate,
        breadcrumbBlock(
          "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/breadcrumbs.jpg?raw=true"
        ),
        logoCarouselBlock(
          "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/logo-carousel.png?raw=true?raw=true"
        ),
        buttonBlock({
          icons: AntIcons,
          previewSrc:
            "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/button.png?raw=true",
        }),
        cardCarouselBlock({
          icons: AntIcons,
          previewSrc:
            "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/card-carousel.jpg?raw=true",
        }),
        imageTextBlock({
          icons: AntIcons,
          previewSrc:
            "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/image-text-block.png?raw=true",
        }),
        accordionBlock({
          icons: AntIcons,
          previewSrc:
            "https://github.com/SSWConsulting/SSW.TinaCMS.LandingKit/blob/main/tina-starter/public/tina/previews/accordion.png?raw=true",
        }),
      ],
    },
  ],
};
