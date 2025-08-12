import { Template } from "tinacms";

export const ImageShowcaseTemplate: Template = {
  name: "imageShowcase",
  label: "Image Showcase",
  fields: [
    {
      type: "image",
      name: "showcaseImages",
      label: "Showcase Images",
      list: true,
      description: "Upload multiple images to showcase",
      ui: {
        defaultItem: "",
        itemProps: (item: any) => ({ 
          label: item ? `Image: ${item.split('/').pop()}` : "New Image" 
        }),
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      description: "Title displayed below the image",
    },
    {
      type: "string",
      name: "showcaseDescription",
      label: "Description",
      description: "Description displayed below the title",
    },
  ],
};