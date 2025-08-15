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
      name: "showcaseImage",
      label: "Showcase Image",
      description: "Upload a single image to showcase",
    },
    {
      type: "string",
      name: "downloadLink",
      label: "Download Link",
      description: "External link to redirect when clicking the download button",
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
