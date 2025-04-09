import { Template, wrapFieldsWithMeta } from "tinacms";
import IconSelector from "../../../tina/customSchemaComponents/IconSelector";

export const bentoBoxTemplate: Template = {
  name: "BentoBox",
  label: "Bento Box",
  fields: [
    {
      name: "badge",
      label: "Badge",
      type: "string",
    },
    {
      name: "badgeLink",
      label: "Badge Link",
      type: "string",
    },
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "topLeftBox",
      label: "Top Left Box",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "icons",
          label: "Icons",
          type: "object",
          list: true,
          ui: {
            itemProps: (item: { iconImage: string; iconToolTipText: string }) => ({
              label: item?.iconToolTipText || 'Default Icon Text',
            }),
          },
          fields: [
            { name: "iconImage", label: "Icon Image", type: "image" },
            {
              name: "iconToolTipText",
              label: "Icon Tooltip Text",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "topRightBox",
      label: "Top Right Box",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
          ui: {
            component: "textarea",
          },
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
          name: "media",
          label: "Media",
          type: "image",
        },
      ],
    },
    {
      name: "counterBox1",
      label: "Counter Box 1",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "counterMetric",
          label: "Counter Metric",
          type: "string",
          options: ["YakShaved", "MinutesSaved"],
        },
      ],
    },
    {
      name: "counterBox2",
      label: "Counter Box 2",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "counterMetric",
          label: "Counter Metric",
          type: "string",
          options: ["YakShaved", "MinutesSaved"],
        },
      ],
    },
    {
      name: "bottomLeftBox",
      label: "Bottom Left Box",
      type: "object",
      fields: [{ name: "media", label: "Media", type: "image" }],
    },
    {
      name: "bottomRightBox",
      label: "Bottom Right Box",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "description",
          label: "Description",
          type: "string",
          ui: { component: "textarea" },
        },
        {
          name: "inputItem",
          label: "Input Item",
          type: "object",
          list: true,
          ui: {
            min: 4,
            max: 4,
          },
          required: true,
          fields: [
            { name: "name", label: "Name", type: "string" },
            {
              name: "icon",
              label: "Icon",
              type: "string",
              description:
                "Can't find the icon you want? ask a developer to add it",
              ui: {
                // @ts-expect-error - TOOD Investigate
                component: wrapFieldsWithMeta(IconSelector),
              },
            },
          ],
        },
        {
          name: "middleLogo",
          label: "Middle Logo",
          type: "image",
        },
        {
          name: "outputText",
          label: "Output Text",
          type: "string",
        },
      ],
    },
  ],
};
