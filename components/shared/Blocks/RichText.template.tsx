import type { Template } from "tinacms";
import { textAlignOptions } from "./RichText";

export const RichTextTemplate: Template = {
  label: "Rich Text",
  name: "richText",
  ui: {
    previewSrc: "/ComponentPreviews/Richtext-Preview.png",
    defaultItem: () => {
      return {
        textAlign: Object.keys(textAlignOptions)[0],
        body: {
          type: "root",
          children: [
            {
              type: "h1",
              children: [
                {
                  type: "text",
                  text: "Lorem Ipsum",
                },
              ],
            },
            {
              type: "p",
              children: [
                {
                  type: "text",
                  text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
                },
              ],
            },
          ],
        },
      };
    },
  },
  fields: [
    {
      name: "textAlign",
      required: true,
      label: "Text Alignment",
      type: "string",
      options: Object.keys(textAlignOptions),
      ui: {
        component: "select",
      },
    },
    {
      name: "body",
      label: "Body",
      type: "rich-text",
      required: true,
    },
  ],
};
