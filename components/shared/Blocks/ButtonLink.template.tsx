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
    {
      required: true,
      name: "label",
      label: "Label",
      type: "string" as const,
    },
    {
      required: true,
      name: "href",
      label: "URL",
      type: "string" as const,
    },
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
    {
      name: "variant",
      label: "Variant",
      type: "string" as const,
      options: [
        { value: "solidRed", label: "Solid Red" },
        { value: "solidWhite", label: "Solid White" },
        { value: "outlinedWhite", label: "Outlined White" },
      ],
    },
  ],
};
