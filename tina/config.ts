import { defineConfig } from "tinacms";
import { PagesSchema } from "./collectionSchema/pages";
import { navigationBarCollection } from "./collectionSchema/navbar";
import { footerCollection } from "./collectionSchema/footer";
import { blogCollection } from "./collectionSchema/blog";
import { docsCollection } from "./collectionSchema/docs";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, 
  token: process.env.TINA_TOKEN, 

  build: {
    outputFolder: 'admin', 
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  // Define the schema
  schema: {
    collections: [
      PagesSchema, 
      navigationBarCollection,
      footerCollection,
      blogCollection,
      docsCollection,
    ],
  },
});
