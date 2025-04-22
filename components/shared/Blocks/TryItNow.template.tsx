import { Template, TinaField } from "tinacms";
import CustomImageField from "../../../tina/customSchemaComponents/optimizedImageField";

const optimizedImageField: TinaField[] = [
  {
    type: "image",
    label: "Image",
    name: "imgSrc",
    ui: {
      component: CustomImageField,
    },
  },
  {
    type: "number",
    name: "imgWidth",
    ui: {
      component: "hidden",
    },
  },
  {
    type: "number",
    name: "imgHeight",
    ui: {
      component: "hidden",
    },
  },
];

const TryItNowTemplate: Template = {
  label: "Try It Now",
  name: "tryItNow",
  fields: [
    {
      name: "topImage",
      label: "Top Image",
      type: "object",
      fields: [...optimizedImageField],
    },
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
          type: "object",
          fields: [
            {
              type: "image",
              label: "Card Image",
              description:
                "Card images will use the aspect ratio of tallest image among the cards",
              name: "imgSrc",
              ui: {
                component: CustomImageField,
              },
            },
            {
              type: "number",
              name: "imgWidth",
              ui: {
                component: "hidden",
              },
            },
            {
              type: "number",
              name: "imgHeight",
              ui: {
                component: "hidden",
              },
            },
          ],
        },
        {
          name: "button",
          label: "Button",
          type: "object",
          fields: [
            {
              name: "enableButton",
              label: "Enable Button",
              type: "boolean",
            },
            {
              name: "label",
              label: "Label",
              type: "rich-text",
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

export default TryItNowTemplate;
