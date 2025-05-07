// File: helloAlgolia.mjs
import { algoliasearch } from "algoliasearch";
import "dotenv/config";
import fg from "fast-glob";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const getDocFileNames = async () => {
  const fileNames = await fg("../content/docs/YakShaver/*.mdx");
  return fileNames;
};

const markdownToPlainText = async (body: string) => {
  const res = await unified()
    .use(remarkParse)
    .use(stripMarkdown)
    .use(remarkStringify)
    .process(body);
  return res.toString();
};

const getMarkdownData = async (fileName: string) => {
  const mdContents = matter.read(fileName, {
    delimiters: ["---", "---"],
    language: "yaml",
  });
  const body = mdContents.content;

  const title = mdContents.data.title;
  const plainText = await markdownToPlainText(body);

  return {
    title: title,
    body: plainText,
  };
};

const fetchDocData = async () => {
  const allFiles = await getDocFileNames();
  const promises = allFiles.map(async (fileName) => {
    const data = await getMarkdownData(fileName);
    return data;
  });

  const results = await Promise.all(promises);

  return results;
};

async function createIndices() {
  const appID = "OPRSAYYMS0"; //process.env.ALGOLIA_APP_ID;

  const apiKey = "4c909bdc3606d2cb16369f154c51a5ed"; //process.env.ALGOLIA_API_KEY;

  const client = algoliasearch(appID, apiKey);

  const docs = await fetchDocData();

  await client.saveObjects({ indexName: "docs_index", objects: docs });
}

createIndices()
  .then(() => {
    console.log("Indices created successfully");
  })
  .catch((error) => {
    console.error("Error creating indices:", error);
  });
