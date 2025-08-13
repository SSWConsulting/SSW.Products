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
      ],
    },
    {
      type: "number",
      label: "Items Per Row",
      name: "itemsPerRow",
      description: "Number of images per row (1-6)",
      ui: {
        validate: (value) => {
          if (value < 1 || value > 6) {
            return "Must be between 1 and 6";
          }
        },
      },
    },
  ],
};
