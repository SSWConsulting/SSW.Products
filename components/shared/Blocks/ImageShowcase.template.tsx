import { Template } from "tinacms";

export const ImageShowcaseTemplate: Template = {
  name: "imageShowcase",
  label: "Image Showcase",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Main Title",
      description: "Main title displayed at the top of the component",
    },
    {
      type: "string",
      name: "gridDescription",
      label: "Main Description",
      description: "Main description displayed below the main title",
    },
    {
      type: "image",
      name: "showcaseImages",
      label: "Showcase Images",
      list: true,
      description: "Upload multiple images to showcase",
    },
    {
      type: "string",
      name: "showcaseTitle",
      label: "Showcase Title",
      description: "Title displayed below the image",
    },
    {
      type: "string",
      name: "showcaseDescription",
      label: "Showcase Description",
      description: "Description displayed below the showcase title",
    },
  ],
};
