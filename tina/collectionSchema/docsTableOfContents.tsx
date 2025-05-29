import { Collection, Template } from "tinacms";

const uiAndLabelling: any = {
  label: "Submenu",
  name: "items",
  ui: {
    itemProps: (item: any) => {
      return { label: "🗂️ " + (item?.title ?? "Unnamed Menu Group") };
    },
  },
};

export const itemTemplate: Template = {
  label: "Item",
  name: "item",
  ui: {
    itemProps: (item) => {
      return { label: "🔗 " + (item?.title ?? "Unnamed Menu Item") };
    },
  },
  fields: [
    { name: "title", label: "Name", type: "string" },
    { name: "slug", label: "Page", type: "reference", collections: ["docs"] },
  ],
};

export const submenuTemplate: Template = {
  ...uiAndLabelling,
  fields: [
    { name: "title", label: "Name", type: "string" },
    {
      name: "items",
      label: "Submenu Items",
      type: "object",
      list: true,
      templates: [itemTemplate],
    },
  ],
};

export const docsTableOfContentsCollection: Collection = {
  label: "Docs Table of Contents",
  name: "docsTableOfContents",
  path: "content/docsTableOfContents/",
  format: "mdx",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      name: "algoliaSearchIndex",
      label: "Algolia Search Index",
      type: "string",
      description: "Used to configure the Algolia search index for the docs",
    },
    {
      name: "parentNavigationGroup",
      label: "Parent Navigation Group",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: "🗂️ " + (item?.title ?? "Unnamed Menu Group") };
        },
      },
      fields: [
        { name: "title", label: "Name", type: "string" },
        {
          name: "items",
          label: "Page or Submenu",
          type: "object",
          list: true,
          templates: [itemTemplate],
        },
      ],
    },
  ],
};
