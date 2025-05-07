// File: helloAlgolia.mjs
import { algoliasearch } from "algoliasearch";
import "dotenv/config";
import fg from "fast-glob";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const getBlogNames = async () => {
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
  // const fileNames = await getBlogNames();
};

const readAllFiles = async () => {
  const allFiles = await getBlogNames();

  const promises = allFiles.map(async (fileName) => {
    const data = await getMarkdownData(fileName);
    return data;
  });
  await Promise.all(promises).then((results) => {
    for (const result of results) {
      console.log(result);
    }
  });
};

async function main() {
  const appID = process.env.ALGOLIA_APP_ID; // Your Algolia App ID
  // API key with `addObject` and `editSettings` ACL
  const apiKey = process.env.ALGOLIA_API_KEY;

  console.log("Algolia App ID:", appID);
  console.log("Algolia API Key:", apiKey);
  return;
  const indexName = "test-index";

  const client = algoliasearch(appID, apiKey);

  const record = { objectID: "object-1", name: "test record" };

  // Add record to an index
  const { taskID } = await client.saveObject({
    indexName,
    body: record,
  });

  // Wait until indexing is done
  await client.waitForTask({
    indexName,
    taskID,
  });

  // Search for "test"
  const { results } = await client.search({
    requests: [
      {
        indexName,
        query: "test",
      },
    ],
  });

  console.log(JSON.stringify(results));

  // import {algoliasearch} from "algoliasearch";
  // import { promises as fs } from "fs";
  // import matter from "gray-matter";
  // import path from "path";

  // // Algolia credentials
  // const ALGOLIA_APP_ID = "YourAlgoliaAppID"; // Replace with your Algolia App ID
  // const ALGOLIA_API_KEY = "YourAlgoliaAdminAPIKey"; // Replace with your Algolia Admin API Key
  // const ALGOLIA_INDEX_NAME = "YourIndexName"; // Replace with your Algolia Index Name

  // // Initialize Algolia client
  // const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

  // // Directory containing your Markdown files
  // const MARKDOWN_DIR = path.resolve("./content/docs/YakShaver");

  // // Define the structure of the front matter and content
  // interface MarkdownData {
  //   objectID: string;
  //   [key: string]: any; // Allow additional front matter fields
  //   content: string;
  // }

  // // Function to read and parse Markdown files
  // async function getMarkdownFiles(dir: string): Promise<MarkdownData[]> {
  //   const files = await fs.readdir(dir);
  //   const markdownData: MarkdownData[] = [];

  //   for (const file of files) {
  //     const filePath = path.join(dir, file);

  //     // Only process .md or .mdx files
  //     if (file.endsWith(".md") || file.endsWith(".mdx")) {
  //       const fileContent = await fs.readFile(filePath, "utf-8");
  //       const { data, content } = matter(fileContent);

  //       // Add parsed data to the array
  //       markdownData.push({
  //         objectID: file, // Use the filename as a unique identifier
  //         ...data, // Front matter (e.g., title, date, etc.)
  //         content, // Markdown content
  //       });
  //     }
  //   }

  //   return markdownData;
  // }

  // // Upload data to Algolia
  // async function uploadToAlgolia(data: MarkdownData[]): Promise<void> {
  //   try {
  //     const response = await index.saveObjects(data);
  //     console.log("Algolia index updated:", response);
  //   } catch (error) {
  //     console.error("Error uploading to Algolia:", error);
  //   }
  // }

  // // Main function
  // async function main(): Promise<void> {
  //   console.log("Reading Markdown files...");
  //   const markdownData = await getMarkdownFiles(MARKDOWN_DIR);

  //   console.log("Uploading data to Algolia...");
  //   await uploadToAlgolia(markdownData);

  //   console.log("Done!");
  // }

  // main().catch((error) => {
  //   console.error("Error in script execution:", error);
  // });
}

// await readAllFiles();

main();

// main().then(() => {
//   console.log("Done!");
// });
