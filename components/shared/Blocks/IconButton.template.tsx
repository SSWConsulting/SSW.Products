import { actionsButtonTemplate } from "./ActionsButton.template";

export const iconButtonTemplate = {
  name: "iconButton",
  label: "Icon Button",
  ui: {
    itemProps: (item: { label?: string }) => ({
      label: `🔗 ${item?.label || "Unlabelled"}`,
    }),
    defaultItem: () => ({
      label: "Default Label",
      url: "/",
      variant: "solidRed",
      size: "medium",
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
    },
  ],
};
