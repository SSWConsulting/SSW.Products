import { actionsButtonTemplate } from "./ActionsButton.template";

export const buttonLinkTemplate = {
  name: "buttonLink",
  label: "Button Link",
  ui: {
    itemProps: (item: { label?: string }) => ({
      label: `🔗 ${item?.label || "Unlabelled"}`,
    }),
    defaultItem: () => ({
      label: "Default Label",
      href: "/",
      variant: "solidRed",
    }),
  },
  fields: [
    ...actionsButtonTemplate.fields,
    {
      name: "icon",
      label: "Icon",
      type: "image" as const,
    },
    {
      name: "iconPosition",
      label: "Icon Position",
      description: "Position of the icon relative to the text",
      type: "string" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    }
  ],
};
