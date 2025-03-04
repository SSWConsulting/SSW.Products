import { TextInputWithCount } from "./TextInputWithCount";

export const seoInformation = {
  type: "object",
  label: "SEO Values",
  name: "seo",
  fields: [
    {
      type: "string",
      label: "Meta - Title",
      description: "Recommended limit of 70 characters",
      name: "title",
      ui: {
        validate: (value: string) => {
          if (value && value.length > 70) {
            return "Title should be 70 characters or less";
          }
        },
        component: TextInputWithCount(70),
      },
    },
    {
      type: "string",
      label: "Meta - Description",
      description: "Recommended limit of 150 characters",
      name: "description",
      component: "textarea",
      ui: {
        component: TextInputWithCount(150, true),
      },
    },
    {
      type: "string",
      label: "Open Graph - Title",
      name: "openGraphTitle",
      description: "Recommended limit of 70 characters",
      ui: {
        validate: (value: string) => {
          if (value && value.length > 70) {
            return "Title should be 70 characters or less";
          }
        },
        component: TextInputWithCount(70),
      },
    },
    {
      type: "string",
      label: "Open Graph - Description",
      name: "openGraphDescription",
      description: "Recommended limit of 150 characters",
    },
    {
      type: "image",
      label: "Open Graph - Image",
      name: "openGraphImage",
      description: "Recommended size of 1200x630px",
    },
  ],
};
