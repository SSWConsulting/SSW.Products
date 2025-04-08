import { Collection } from "tinacms";

const blogCategoriesCollection: Collection = {
  name: "globalCollection",
  path: "content/global/",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      name: "blogCategories",
      label: "Blog Categories Name",
      description: "You can assign blog posts to these categories",
      type: "string",
      list: true,
    },
  ],
};

export default blogCategoriesCollection;
