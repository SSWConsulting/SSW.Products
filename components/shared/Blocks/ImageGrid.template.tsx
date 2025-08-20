import { Template } from "tinacms";

const validateNumber = (min: number, max: number, errorMsg: string) => (value: any) => {
  const numValue = Number(value);
  return !isNaN(numValue) && (numValue < min || numValue > max) ? errorMsg : undefined;
};

export const ImageGridTemplate: Template = {
  label: "Image Grid",
  name: "imageGrid",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      description: "Optional title displayed above the image grid",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "gridDescription",
      description: "Optional description displayed below the title. Supports rich text formatting including links, bold, italic, etc.",
    },
    {
      type: "object",
      label: "Images",
      name: "images",
      list: true,
      fields: [
        {
          type: "image",
          label: "SVG File",
          name: "svgSrc",
          description: "Select SVG file from Media Manager",
        },
         {
          type: "string",
          label: "SVG Download URL",
          name: "svgDownloadUrl",
          description: "Optional custom download link for SVG. If provided, takes priority over the SVG file from Media Manager",
        },
        {
          type: "image",
          label: "PNG File", 
          name: "pngSrc",
          description: "Select PNG file from Media Manager",
        },
        {
          type: "string",
          label: "PNG Download URL",
          name: "pngDownloadUrl",
          description: "Optional custom download link for PNG. If set, opens in new tab instead of downloading directly",
        },
        {
          type: "string",
          label: "Block Color",
          name: "blockColor",
          description: "Background color for the image block (e.g., #ffffff, red, transparent)",
          ui: { component: "color" },
        },
        {
          type: "number",
          label: "Image Scale",
          name: "imageScale",
          description: "Scale factor for the image (0.1 to 2.0, default: 1.0)",
          ui: {
            component: "number",
            step: 0.1,
            validate: validateNumber(0.1, 2.0, "Scale must be between 0.1 and 2.0"),
          } as any,
        },
        {
          type: "boolean",
          label: "Enable Download Button",
          name: "enableDownload",
          description: "Show download button on hover. If disabled, only displays the image without download functionality.",
          ui: { component: "toggle" },
        },
      ],
    },
    {
      type: "number",
      label: "Items Per Row",
      name: "itemsPerRow",
      description: "Number of images per row (1-6)",
      ui: { validate: validateNumber(1, 6, "Must be between 1 and 6") },
    },
    {
      type: "number",
      label: "Aspect Ratio",
      name: "aspectRatio",
      description: "Height ratio relative to width (0.65 for default, 0.8 for taller, 0.5 for shorter)",
      ui: {
        component: "number",
        step: 0.05,
        validate: validateNumber(0.01, 2, "Aspect ratio must be between 0.01 and 2"),
      } as any,
    },
  ],
};
