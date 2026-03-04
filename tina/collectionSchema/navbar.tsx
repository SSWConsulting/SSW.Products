import { jotFormBookingButtonSchema } from "@comps/shared/Blocks/BookingButton.template";
import { iconButtonTemplate } from "@comps/shared/Blocks/IconButton.template";
import { optimizedImageField } from "@tina/shared/OptimizedImage";
import { Collection, TinaField } from "tinacms";

const linkFields: TinaField[] = [
  {
    required: true,
    name: "label",
    label: "Label",
    type: "string",
  },
  {
    required: true,
    name: "href",
    label: "href",
    type: "string",
  },
  {
    name: "openInNewTab",
    label: "Open in New Tab",
    type: "boolean",
  },
  {
    name: "title",
    label: "Title",
    type: "string",
  },
];

export const navigationBarCollection: Collection = {
  label: "Navigation Bar",
  name: "navigationBar",
  path: "content/navBars",
  format: "json",
  fields: [
    ...optimizedImageField,
    {
      name: "leftNavItem",
      label: "Menu Items",
      list: true,
      type: "object",
      templates: [
        {
          name: "stringItem",
          label: "Menu Item",
          ui: {
            itemProps: (item: { label: string }) => {
              return { label: "🔗 " + (item?.label || "Unlabelled") };
            },
          },
          fields: [...linkFields],
        },
        {
          name: "groupOfStringItems",
          label: "Sub Menu",
          ui: {
            itemProps: (item) => {
              return { label: "🗂️ " + (item?.label || "Unlabelled") };
            },
          },

          fields: [
            {
              required: true,
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "items",
              label: "Menu Item",
              type: "object",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: `🔗 ${item?.label || "Unlabelled"}` };
                },
              },
              fields: [...linkFields],
            },
          ],
        },
      ],
    },
    {
      name: "buttons",
      label: "Buttons",
      list: true,
      type: "object",
      templates: [
        jotFormBookingButtonSchema,
        iconButtonTemplate,
      ],
    },
  ],
};
