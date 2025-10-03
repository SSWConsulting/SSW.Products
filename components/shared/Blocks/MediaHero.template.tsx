import { Template } from "tinacms";

export const MediaHeroTemplate: Template = {
  label: "Media Hero",
  name: "mediaHero",
  fields: [
    {
      type: "string",
      label: "Hero Title",
      name: "heroTitle",
    },
    {
      type: "string",
      label: "Hero Description",
      name: "heroDescription",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      label: "Button",
      name: "heroButton",
      fields: [
        {
          type: "string",
          label: "Button Label",
          name: "label",
        },
        {
          type: "image",
          label: "Button Icon",
          name: "iconSrc",
          description: "Select an icon from Media Manager (SVG or PNG recommended)",
        },
        {
          type: "string",
          label: "Link URL",
          name: "href",
        },
        {
          type: "string",
          label: "Link Target",
          name: "target",
          description: "Choose how the link opens",
          options: [
            { value: "_self", label: "Same window/tab (_self)" },
            { value: "_blank", label: "New window/tab (_blank)" }
          ],
        },
      ],
    },
    {
      type: "string",
      label: "Date Text",
      name: "dateText",
      description: "Small text displayed below the button",
    },
  ],
};