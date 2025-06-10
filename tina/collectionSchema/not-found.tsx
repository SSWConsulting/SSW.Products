import { optimizedImageField } from "@comps/shared/Blocks/TryItNow.template";
import { Collection } from "tinacms";
const notFoundCollection: Collection = {
  name: "notFound",
  label: "Not Found",
  path: "content/notFound/",
  format: "mdx",
  ui: {
    router: () => `404`,
    // allowedActions: {
    //   create: false,
    //   delete: false,
    // },
  },
  fields: [
    {
      name: "heading",
      label: "Heading",
      type: "string",
      required: true,
    },
    {
      name: "body",
      label: "Body",
      type: "rich-text",
      required: true,
      isBody: true,
    },
    ...optimizedImageField,
  ],
};

export { notFoundCollection };
