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
    {
      type: 'object',
      label: 'Google Structured Data',
      name: 'googleStructuredData',
      fields: [
        {
          type: 'string',
          label: 'context',
          name: 'context',
          
        },
        {
          type: 'string',
          label: 'type',
          name: 'type',
        },
        {
          type: 'string',
          label: 'name',
          name: 'name',
        },
        {
          type: 'string',
          label: 'applicationCategory',
          name: 'applicationCategory',
        },
        {
          type: 'string',
          label: 'operatingSystem',
          name: 'operatingSystem',
        },
        {
          type: 'object',
          name: 'aggregateRating',
          label: 'aggregateRating',
          fields: [
            { type: 'string', label: 'type', name: 'type'},
            { type: 'string', label: 'ratingValue', name: 'ratingValue'},
            { type: 'string', label: 'ratingCount', name: 'ratingCount'},
          ]
        },
        {
          type: 'object',
          label: 'offers',
          name: 'offers',
          fields: [
            { type: 'string', label: '@type', name: 'type'},
            { type: 'string', label: 'price', name: 'price'},
            { type: 'string', label: 'priceCurrency', name: 'priceCurrency'},
          ]
        },
      ]
    }
  ],
};
