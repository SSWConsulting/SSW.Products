import { Collection, TinaField } from "tinacms";
import { seoInformation } from "../shared/SEOInformation";

export const privacyPolicyCollection: Collection = {
  label: "Privacy Policy",
  ui: {
    router: ({ document }) => {
      return document?._sys?.filename;
    },
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  name: "privacy",
  path: "content/pages/",
  format: "mdx",
  fields: [
    seoInformation as TinaField,
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      list: false,
      ui: {
        defaultValue: "Privacy Policy",
        validate: (value) => {
          if (value?.length > 70) {
            return "Title can not be more then 70 characters long";
          }
        },
      },
    },
    {
      type: "string",
      name: "date",
      label: "Date Created",
      ui: {
        component: "date",
      },
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      parser: {
        type: "mdx",
      },
    },
  ],
};
