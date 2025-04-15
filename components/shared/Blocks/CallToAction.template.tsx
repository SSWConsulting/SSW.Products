import { Template } from "tinacms";

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
      name: "button",
      type: "object",
      label: "Button",
      fields: [
        {
          name: "buttonText",
          label: "Button Text",
          type: "string",
        },
        {
          name: "buttonLink",
          label: "Button Link",
          type: "string",
        },
      ],
    },
  ],
};
