import React from "react";
import { Collection, Template, TinaField } from "tinacms";
import { seoInformation } from "../shared/SEOInformation";
export const blogCollection: Collection = {
  label: "Blog Posts",
  name: "blogs",
  path: "content/blogs/",
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
      type: "string",
      name: "author",
      label: "Author",
    },
    {
      label: "Category",
      name: "category",
      type: "string",
      options: ["What's New", "Getting Started"],
      ui: {
        component: "select",
      },
    },
    {
      type: "string",
      name: "sswPeopleLink",
      label: "Author SSW People Link",
    },
    {
      type: "string",
      name: "readLength",
      label: "Read (time) length",
      description:
        "Want to get an accurate read length? Use a read-o-meter! https://niram.org/read/",
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
          fields: [
            {
              type: "string",
              name: "embedSrc",
              label: "Embed URL",
              description:
                "⚠︎ Only YouTube embed URLs work - they look like this https://www.youtube.com/embed/Yoh2c5RUTiY",
            },
          ],
        },
      ],
    },
  ],
};

const heroSearchTemplate: Template = {
  label: "Hero Search",
  name: "heroSearch",
  ui: {
    defaultItem: {
      label: "Title",
      title: "title",
    },
  },
  fields: [
    {
      name: "title",
      label: "The title at the top of the hero component",
      type: "string",
    },
    {
      name: "description",
      label: "The description at the top of the hero component",
      type: "string",
    },
  ],
};

const newsletterTemplate: Template = {
  label: "Call To Action",
  name: "callToAction",
  ui: {
    defaultItem: () => {
      return { title: "Title" };
    },
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "description",
      label: "Description",
      type: "string",
    },
    {
      name: "button",
      type: "object",
      fields: [
        {
          name: "buttonText",
          label: "Button Text",
          type: "string",
        },
        {
          name: "buttonLink",
          label: "Button Text",
          type: "string",
        },
      ],
    },
    {
      name: "image",
      label: "Image",
      type: "object",
      fields: [
        {
          name: "image",
          type: "image",
          label: "Image",
        },
        {
          name: "altText",
          label: "Alt Text",
          description: "Alt text for the Image field",
          type: "string",
        },
      ],
    },
  ],
};

const featuredBlogTemplate: Template = {
  label: "Featured Blog",
  name: "featuredBlog",
  ui: {
    defaultItem: () => {
      return { title: "Featured Article" };
    },
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      ui: {
        optionComponent: (props, _sys) => {
          const title = props.title || _sys.filename;
          return (
            <React.Fragment>
              <p>{String(title)}</p>
            </React.Fragment>
          );
        },
      },
      label: "Featured Blog",
      name: "featuredBlog",
      type: "reference",
      collections: ["blogs"],
    },
  ],
};

const articleListTemplate: Template = {
  label: "Article List",
  name: "articleList",
  ui: {
    defaultItem: () => {
      return { title: "Recent Articles" };
    },
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
  ],
};

export const blogIndexCollection: Collection = {
  path: "content/indexPages/",
  format: "json",
  label: "Blog Index",
  name: "blogsIndex",
  fields: [
    {
      name: "blocks",
      type: "object",
      list: true,
      label: "Blocks",
      templates: [
        heroSearchTemplate,
        articleListTemplate,
        featuredBlogTemplate,
        newsletterTemplate,
      ],
    },
  ],
};
