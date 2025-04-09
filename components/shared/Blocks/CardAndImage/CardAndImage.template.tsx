import { Template } from "tinacms";

export const CardAndImageTemplate: Template = {
  name: "CardAndImage",
  label: "Card and Image Parent Container",
  fields: [
    {
        name: 'ParentContainerTitle',
        label: 'Parent Container Title',
        type: 'string',
    },
    {
      name: 'ParentContainerDescription',
      label: 'Parent Container Description',
      type: 'string',
      ui: {
        component: 'textarea',
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
            name: 'Badge1Text',
            label: 'Badge 1 Text',
            type: 'string',
        },
        {
            name: 'Badge2Text',
            label: 'Badge 2 Text',
            type: 'string',
        },
        {
          name: 'Badge3Text',
          label: 'Badge 3 Text',
          type: 'string',
        },
        // TODO add button support down the road
        {
            name: 'media',
            label: 'media',
            type: 'image',
        },
        {
            name: 'textOnLeft',
            label: 'is the text on the left?',
            type: 'boolean'
        },
      ],
    },
  ],
};
