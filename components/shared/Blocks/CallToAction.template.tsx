import { Template } from "tinacms";
import { genericButtonTemplateFields } from "./genericButtonTemplateFields";

export const callToActionTemplate: Template = {
  label: "Call To Action",
  name: "callToAction",
  ui: {
    defaultItem: () => {
      return { title: "Title" };
    },
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "ctaDescription",
      label: "Description",
      type: "string",
    },
    {
      name: "ctaButton",
      type: "object",
      ui: {
        defaultItem: () => {
          return {
            label: "Button",
            buttonLink: "/",
            variant: "solidRed",
            size: "medium",
          };
        },
      },
      label: "Button",
      fields: [
        ...genericButtonTemplateFields.fields,
        {
          name: "buttonLink",
          label: "Button Link",
          type: "string",
        },
      ],
    },
  ],
};
