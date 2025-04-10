import { defineConfig } from "tinacms";
import { blogCollection, blogIndexCollection } from "./collectionSchema/blog";
import { docsCollection } from "./collectionSchema/docs";
import { footerCollection } from "./collectionSchema/footer";
import { navigationBarCollection } from "./collectionSchema/navbar";
import { PagesSchema } from "./collectionSchema/pages";
import { privacyPolicyCollection } from "./collectionSchema/privacy";

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
    outputFolder: "admin",
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
      privacyPolicyCollection,
      navigationBarCollection,
      footerCollection,
      blogCollection,
      blogIndexCollection,
      docsCollection,
    ],
  },
});
