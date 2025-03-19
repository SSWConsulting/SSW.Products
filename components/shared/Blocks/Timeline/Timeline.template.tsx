import { Template } from "tinacms";

export const timelineTemplate: Template = {
  name: "Timeline",
  label: "Timeline",
  ui: {
    itemProps: (item) => {
      return { label: '<Timeline> - ' + item?.title };
    },
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "items",
      label: "Items",
      list: true,
      type: "object",
      ui: {
        itemProps: (item) => {
          return { label: item?.title };
        },
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "description",
          label: "Description",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "badgeTitle",
          label: "Badge Title",
          type: "string",
        },
        {
          name: "badgeLink",
          label: "Badge Link",
          type: "string",
          description: "Optional"
        },
      ],
    },
  ],
};
