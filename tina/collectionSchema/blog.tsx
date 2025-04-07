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
  label: "Newsletter",
  name: "newsletter",
  fields: [
    {
      name: "placeholder",
      label: "placeholder",
      type: "string",
    },
  ],
};

const featuredBlogTemplate: Template = {
  label: "Featured Blog",
  name: "featuredBlog",
  fields: [
    {
      name: "featuredBlog",
      type: "reference",
      collections: ["blogs"],
    },
  ],
};

const articleListTemplate: Template = {
  label: "Article List",
  name: "articleList",
  fields: [
    {
      name: "placeholder",
      label: "placeholder",
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
