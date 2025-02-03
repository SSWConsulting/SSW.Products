import { Collection } from "tinacms";

export const blogCollection: Collection = {
  label: "Blog Posts",
  name: "blogs",
  path: "content/blogs/",
  format: "mdx",
  fields: [
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
      type: 'string',
      name: 'sswPeopleLink',
      label: 'Author SSW People Link'
    },
    {
      type: 'string',
      name: 'readLength',
      label: 'Read (time) length',
      description: 'Want to get an accurate read length? Use a read-o-meter! https://niram.org/read/'
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
          name: 'Youtube',
          label: 'Youtube Embed',
          fields: [
            {
              type: 'string',
              name: 'embedSrc',
              label: 'Embed URL',
              description:
                '⚠︎ Only YouTube embed URLs work - they look like this https://www.youtube.com/embed/Yoh2c5RUTiY',
            },
          ],
        },
      ]
    },
  ],
};
