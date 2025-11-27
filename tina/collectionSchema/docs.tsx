import { optimizedYoutubeFields } from "@comps/shared/Blocks/VideoDisplay.template";
import { Collection, TinaField } from "tinacms";
import { seoInformation } from "../shared/SEOInformation";
import { imageEmbedTemplate } from "@comps/shared/Blocks/ImageEmbed";

export const docsCollection: Collection = {
  label: "Docs",
  name: "docs",
  path: "content/docs/",
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
        validate: (value) => {
          if (value?.length > 70) {
            return "Title can not be more then 70 characters long";
          }
        },
      },
    },
    {
      // note: default to current date/time
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
      templates: [
        {
          name: "Youtube",
          label: "Youtube Embed",
          fields: [...optimizedYoutubeFields],
        },
        imageEmbedTemplate,
        {
          name: "Collapsible",
          label: "Collapsible Section",
          fields: [
            { name: "title", label: "Title", type: "string", required: true },
            { name: "defaultOpen", label: "Default Open", type: "boolean" },
            {
              name: "level",
              label: "Heading Level (h2–h6)",
              type: "string",
              ui: { component: "select" },
              options: [
                { label: "h2", value: "2" },
                { label: "h3", value: "3" },
                { label: "h4", value: "4" },
                { label: "h5", value: "5" },
                { label: "h6", value: "6" },
              ],
            },
            { name: "icon", label: "Icon", type: "image", required: false },
            {
              name: "content",
              label: "Content",
              type: "rich-text",
              templates: [
                imageEmbedTemplate,
                {
                  name: "Youtube",
                  label: "Youtube Embed",
                  fields: [...optimizedYoutubeFields],
                },
              ],
            },
          ],
        },
        {
          name: "OutlineBox",
          label: "Outline Box",
          fields: [
            {
              type: "rich-text",
              name: "content",
              label: "Content",
              templates: [
                imageEmbedTemplate
              ],
            },
          ],
        },
      ],
    },
  ],
};
