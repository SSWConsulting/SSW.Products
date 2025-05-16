import { algoliasearch } from "algoliasearch";
import "dotenv/config";
import fg from "fast-glob";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const getDocFileNames = async (globPattern: string) => {
  const fileNames = await fg(globPattern);
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

const getDocumentationData = async (fileName: string) => {
  const mdContents = matter.read(fileName, {
    delimiters: ["---", "---"],
    language: "yaml",
  });
  const slug = fileName.split("/").slice(-1)[0].replace(".mdx", "");
  const body = mdContents.content;

  const title = mdContents.data.title;
  const plainText = await markdownToPlainText(body);

  return {
    title: title,
    body: plainText,
    file: slug,
  };
};

const fetchDocData = async (globPattern: string) => {
  const allFiles = await getDocFileNames(globPattern);
  const promises = allFiles.map(async (fileName) => {
    const data = await getDocumentationData(fileName);
    return data;
  });

  const results = await Promise.all(promises);
  return results;
};

async function createIndices() {
  const appID = process.env.ALGOLIA_APP_ID;

  const apiKey = process.env.ALGOLIA_API_KEY;

  if (!appID || !apiKey) {
    throw new Error(
      "Algolia credentials are not set in the environment variables."
    );
  }
  const client = algoliasearch(appID, apiKey);
  const docData = await Promise.all([
    fetchDocData("./content/docs/YakShaver/*.mdx"),
    fetchDocData("./content/docs/EagleEye/*.mdx"),
  ]);

  const yakShaverDocs = docData[0];
  const eagleEyeDocs = docData[1];

  await client.replaceAllObjects({
    indexName: "yakshaver_docs",
    objects: yakShaverDocs,
  });
  await client.replaceAllObjects({
    indexName: "eagleeye_docs",
    objects: eagleEyeDocs,
  });
}

createIndices()
  .then(() => {
    console.log("Indices created successfully");
  })
  .catch((error) => {
    console.error("Error creating indices:", error);
  });
