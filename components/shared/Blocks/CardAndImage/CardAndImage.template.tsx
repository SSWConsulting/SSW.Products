import { Template } from "tinacms";

export const CardAndImageTemplate: Template = {
  name: "CardAndImage",
  label: "Card and Image Parent Container",
  fields: [
    {
      name: "ParentContainerTitle",
      label: "Parent Container Title",
      type: "string",
    },
    {
      name: "ParentContainerDescription",
      label: "Parent Container Description",
      type: "string",
      ui: {
        component: "textarea",
      },
    },

    {
      name: "CardAndImageItem",
      label: "Card and Image Child Item",
      list: true,
      type: "object",
      fields: [
        {
          name: "AboveHeaderText",
          label: "Above Header Text",
          type: "string",
        },
        {
          name: "Header",
          label: "Header",
          type: "string",
        },
        {
          name: "Description",
          label: "Description",
          type: "rich-text",
          // ui: { component: "textarea" },
        },
        {
          name: "Badges",
          label: "Badges",
          type: "object",
          list: true,
          fields: [
            {
              name: "Badge",
              label: "Badge Text",
              type: "string",
            },
          ],
        },
        {
          name: "delimiters",
          label: "delimiters",
          type: "object",
          description: "Adds delimiting text between badges",
          fields: [
            {
              type: "boolean",
              name: "enabled",
              label: "Enabled",
              description: "Feature flag for enabling badge delimiters",
            },
            {
              name: "delimeter",
              label: "Delimeter",
              type: "string",
            },
            {
              name: "suffix",
              label: "Suffix",
              type: "string",
            },
          ],
        },
        // TODO add button support down the road
        {
          name: "media",
          label: "media",
          type: "image",
        },
        {
          name: "textOnLeft",
          label: "is the text on the left?",
          type: "boolean",
        },
      ],
    },
  ],
};
