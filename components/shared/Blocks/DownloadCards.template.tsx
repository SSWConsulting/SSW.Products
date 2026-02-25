import { optimizedImageField } from "@tina/shared/OptimizedImage";
import { Template } from "tinacms";

const DownloadCardsTemplate: Template = {
  label: "Download Cards",
  name: "downloadCards",
  fields: [
    {
      name: "topImage",
      label: "Top Image",
      type: "object",
      fields: [...optimizedImageField],
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
      fields: [
        { name: "title", label: "Title", type: "string" },
        {
          name: "description",
          label: "Description",
          type: "rich-text",
        },
        {
          name: "colSpan",
          label: "Column Span",
          description:
            "Width in a 3-column grid. Use 1 for normal (1/3), 2 for wide (2/3). Leave blank for auto layout.",
          type: "number",
        },
        {
          name: "buttons",
          label: "Download Buttons",
          type: "object",
          list: true,
          fields: [
            {
              name: "icon",
              label: "Button Icon",
              description: "Optional icon shown before the button label",
              type: "image",
            },
            {
              name: "label",
              label: "Button Label",
              type: "string",
            },
            {
              name: "link",
              label: "Link",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "bottomLinks",
      type: "object",
      label: "Bottom Links",
      list: true,
      fields: [
        { name: "label", label: "Label", type: "rich-text" },
        {
          name: "url",
          label: "URL",
          type: "string",
        },
      ],
    },
  ],
};

export default DownloadCardsTemplate;
