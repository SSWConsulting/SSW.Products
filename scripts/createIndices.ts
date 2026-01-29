import { algoliasearch } from "algoliasearch";
import "dotenv/config";
import fg from "fast-glob";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";
import { Product } from "../src/types/product-list";

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
  const productListJson = process.env.NEXT_PUBLIC_PRODUCT_LIST;

  if (!appID || !apiKey) {
    throw new Error(
      "Algolia credentials are not set in the environment variables."
    );
  }

  if (!productListJson) {
    throw new Error(
      "NEXT_PUBLIC_PRODUCT_LIST is not set in the environment variables."
    );
  }

  const productList: Product[] = JSON.parse(productListJson);
  const client = algoliasearch(appID, apiKey);

  await Promise.all(
    productList.map(async ({ product }: Product) => {
      const globPattern = `./content/docs/${product}/*.mdx`;
      const docData = await fetchDocData(globPattern);
      const indexName = `${product.toLowerCase()}_docs`;

      console.log(`Rebuilding index: ${indexName} (${docData.length} documents)`);

      await client.replaceAllObjects({
        indexName,
        objects: docData,
      });

      await client.setSettings({
      indexName,
      indexSettings: {
          attributesToSnippet: ['body:10'],
        },
      });

      console.log(`✅ Index ${indexName} rebuilt successfully`);
    })
  );
}

createIndices()
  .then(() => {
    console.log("Indices created successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating indices:", error);
    process.exit(1);
  });
