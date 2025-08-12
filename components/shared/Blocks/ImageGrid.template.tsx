import { Template } from "tinacms";

export const ImageGridTemplate: Template = {
  label: "Image Grid",
  name: "imageGrid",
  fields: [
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