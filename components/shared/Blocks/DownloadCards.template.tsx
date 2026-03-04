import { optimizedImageField } from "@tina/shared/OptimizedImage";
import { Template } from "tinacms";
import { iconButtonTemplate } from "./IconButton.template";

const DownloadCardsTemplate: Template = {
  label: "Download Cards",
  name: "downloadCards",
  ui: {
    defaultItem: () => ({
      title: "Downloads",
      cards: [],
    }),
  },
  fields: [
    {
      name: "topImage",
      label: "Top Image",
      type: "object",
      fields: [
        ...optimizedImageField,
        {
          name: "imgAlt",
          label: "Alt Text",
          type: "string",
          ui: {
            defaultValue: "Product logo",
          },
        },
      ],
    },
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "cards",
      label: "Cards",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: { title?: string }) => ({
          label: item?.title || "Default Card",
        }),
        defaultItem: () => ({
          title: "Card Title",
          colSpan: "1",
          buttons: [],
        }),
      },
      fields: [
        { name: "title", label: "Title", type: "string" },
        {
          name: "descriptionLhs",
          label: "Description (Left Hand Side)",
          type: "rich-text",
        },
        {
          name: "descriptionRhs",
          label: "Description (Right Hand Side) - Only appears if Column Span is 2 or more",
          type: "rich-text",
        },
        {
          name: "colSpan",
          label: "Column Span",
          description:
            "Width in a 3-column grid. 1 = normal (1/3), 2 = wide (2/3).",
          type: "string" as const,
          options: [
            { label: "1 - Normal (1/3)", value: "1" },
            { label: "2 - Wide (2/3)", value: "2" },
            { label: "3 - Full width", value: "3" },
          ],
        },
        {
          name: "buttons",
          label: "Buttons",
          list: true,
          type: "object",
          templates: [iconButtonTemplate],
        },
      ],
    },
  ],
};

export default DownloadCardsTemplate;
