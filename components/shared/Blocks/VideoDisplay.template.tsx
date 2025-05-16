import { Template } from "tinacms";

export const videoDisplayTemplate: Template = {
  label: "Video Display",
  name: "videoDisplay",
  fields: [
    { name: "altText", label: "Alt Text", type: "string" },
    { name: 'title', label: 'Title', type: 'string' },  
    { name: "externalVideoLink", type: "string", label: "External Video Link" },
    { name: 'figureCaption', label: 'Figure Caption', type: 'string' },
  ],
};
