import { Collection } from "tinacms";
import { jotFormBookingButtonSchema } from "../../components/shared/Blocks/BookingButton.template";

export const navigationBarCollection: Collection = {
  label: "Navigation Bar",
  name: "navigationBar",
  path: "content/navBars",
  format: "json",
  defaultItem: () => {

  },
  fields: [
    {
      name: "Logo",
      label: "Logo",
      type: "image",
    },
    {
      name: "leftNavItem",
      label: "Left Side Navigation Item",
      list: true,
      type: "object",
      templates: [
        {
          name: "stringItem",
          label: "String Item",
          ui: {
            itemProps: (item: { label: string }) => {
              return { label: "🔗 " + item?.label };
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "href",
              label: "href",
              type: "string",
            },
          ],
        },
        {
          name: "groupOfStringItems",
          label: "Group Of String Items",
          ui: {
            itemProps: (item) => {
              return { label: "🗂️ " + item?.label };
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "items",
              label: "Page or Submenu",
              type: "object",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: item?.label };
                },
              },
              fields: [
                {
                  name: "label",
                  label: "Label",
                  type: "string",
                },
                {
                  name: "href",
                  label: "href",
                  type: "string",
                },
              ],
            },
          ],
        },
        {
          label: "Modal Button",
          name: "modalButton",
          ui: {
            itemProps: (item) => {
              return { label: "🍌 " + item?.label };
            },
            defaultItem: {
              variant: "default",
              label: "Secondary Action",
              icon: false,
              size: "medium",
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "variant",
              label: "Variant",
              type: "string",
              options: ["default", "primary", "secondary"],
            },
            {
              name: "size",
              label: "Size",
              type: "string",
              options: ["small", "medium", "large"],
            },
            {
              name: "icon",
              label: "Icon",
              type: "boolean",
            },
          ],
        },
      ],
    },
    {
      name: "rightNavItem",
      label: "Right Side Navigation Item",
      list: true,
      type: "object",
      templates: [
        {
          name: "stringItem",
          label: "String Item",
          ui: {
            itemProps: (item: { label: string }) => {
              return { label: "🔗 " + item?.label };
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "href",
              label: "href",
              type: "string",
            },
          ],
        },
        {
          name: "groupOfStringItems",
          label: "Group Of String Items",
          ui: {
            itemProps: (item) => {
              return { label: "🗂️ " + item?.label };
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "items",
              label: "Page or Submenu",
              type: "object",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: item?.label };
                },
              },
              fields: [
                {
                  name: "label",
                  label: "Label",
                  type: "string",
                },
                {
                  name: "href",
                  label: "href",
                  type: "string",
                },
              ],
            },
          ],
        },
        {
          ...jotFormBookingButtonSchema,
        },
      ],
    },
  ],
};
