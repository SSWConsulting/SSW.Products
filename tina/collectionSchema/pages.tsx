import { Collection } from "tinacms";
import { FeaturesTemplate } from "../../components/shared/Blocks/Features.template";
import { FAQTemplate } from "../../components/shared/Blocks/FAQ.template";
import { CarouselFeatureTemplate } from "../../components/shared/Blocks/FeatureCarousel.template";
import { pricingTemplate } from "../../components/shared/Blocks/Pricing.template";
import { BannerTemplate } from "../../components/shared/Blocks/Banner.template";
import { videoDisplayTemplate } from "../../components/shared/Blocks/VideoDisplay.template";

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
      templates: [FeaturesTemplate, FAQTemplate, CarouselFeatureTemplate, pricingTemplate, BannerTemplate, videoDisplayTemplate],
    },
  ],
};
