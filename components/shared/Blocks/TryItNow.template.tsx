import { Template } from "tinacms";

const TryItNowTemplate: Template = {
  label: "Try It Now",
  name: "tryItNow",
  fields: [
    {
      name: "tryItNowTitle",
      label: "Title",
      type: "string",
    },
    {
      name: "tryItNowCards",
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
          name: "image",
          label: "Image",
          type: "image",
        },
        {
          name: "button",
          label: "Button",
          type: "object",
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};

export default TryItNowTemplate;
