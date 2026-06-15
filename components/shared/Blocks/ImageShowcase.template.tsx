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
      type: "rich-text",
      name: "gridDescription",
      label: "Main Description",
      description: "Main description displayed below the main title. Supports rich text formatting including links, bold, italic, etc.",
    },
    {
      type: "image",
      name: "showcaseImage",
      label: "Showcase Image",
      description: "Upload a single image to showcase",
    },
    {
      type: "string",
      name: "downloadFile",
      label: "Download File Path",
      description: "Path to the downloadable file (e.g., '/YakShaver/YakShaver-Background.zip')",
    },
    {
      type: "string",
      name: "showcaseTitle",
      label: "Showcase Title",
      description: "Title displayed below the image",
    },
    {
      type: "rich-text",
      name: "showcaseDescription",
      label: "Showcase Description",
      description: "Description displayed below the showcase title. Supports rich text formatting including links, bold, italic, and lists.",
    },
  ],
};
