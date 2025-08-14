import { Template } from "tinacms";

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
      type: "string",
      label: "Description",
      name: "gridDescription",
      description: "Optional description displayed below the title",
      ui: {
        component: "textarea",
      },
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
          ui: {
            component: "color",
          },
        },
        {
          type: "number",
          label: "Image Scale",
          name: "imageScale",
          description: "Scale factor for the image (0.1 to 2.0, default: 1.0)",
          ui: {
            step: 0.1,
            validate: (value: any) => {
              const numValue = Number(value);
              if (!isNaN(numValue) && (numValue < 0.1 || numValue > 2.0)) {
                return "Scale must be between 0.1 and 2.0";
              }
            },
          },
        },
      ],
    },
    {
      type: "number",
      label: "Items Per Row",
      name: "itemsPerRow",
      description: "Number of images per row (1-6)",
      ui: {
        validate: (value: any) => {
          const numValue = Number(value);
          if (!isNaN(numValue) && (numValue < 1 || numValue > 6)) {
            return "Must be between 1 and 6";
          }
        },
      },
    },
  ],
};
