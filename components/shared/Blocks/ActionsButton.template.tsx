import { genericButtonTemplateFields } from "./genericButtonTemplateFields";

interface ActionButtonItem {
  label?: string;
}

export const actionsButtonTemplate = {
  label: "Actions Button",
  name: "actions",
  type: "object",
  list: true,
  ui: {
    itemProps: (item: ActionButtonItem) => ({
      label: item?.label || "Default Label",
    }),
    defaultItem: () => ({
      label: "Default Label",
      url: "/",
      variant: "solidRed",
      size: "medium",
    }),
  },
  fields: [
    ...genericButtonTemplateFields.fields,
    { name: "url", label: "URL", type: "string" as const },
    { name: "icon", label: "Icon", type: "image" as const },
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
