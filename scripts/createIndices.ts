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
  // Translations live in a zh/ folder beside the English docs and are indexed
  // per-locale elsewhere, so they must not pollute the English index.
  const fileNames = await fg(globPattern, { ignore: ["**/zh/**"] });
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

// Algolia rejects any record over 10KB, and one oversized doc fails the whole
// index rebuild - so a long doc's body is cut short, leaving room to spare
const MAX_RECORD_BYTES = 9000;

// What a character split in two decodes to
const REPLACEMENT_CHARACTER = String.fromCharCode(0xfffd);

const truncateToBytes = (text: string, maxBytes: number) => {
  if (Buffer.byteLength(text) <= maxBytes) return text;
  const truncated = Buffer.from(text).subarray(0, maxBytes).toString();
  // Cutting the bytes can split the last character - drop what's left of it
  return truncated.endsWith(REPLACEMENT_CHARACTER)
    ? truncated.slice(0, -1)
    : truncated;
};

// Measured as JSON, as Algolia does - newlines and quotes are escaped there, so
// the record can be bigger than its raw text
const recordBytes = (record: object) => Buffer.byteLength(JSON.stringify(record));

const fitRecord = <T extends { body: string }>(record: T): T => {
  let fitted = record;
  let excess = recordBytes(fitted) - MAX_RECORD_BYTES;
  // Each cut removes at least `excess` bytes of JSON, so this ends in a few rounds
  while (excess > 0 && fitted.body) {
    fitted = {
      ...fitted,
      body: truncateToBytes(fitted.body, Buffer.byteLength(fitted.body) - excess),
    };
    excess = recordBytes(fitted) - MAX_RECORD_BYTES;
  }
  return fitted;
};

const getDocumentationData = async (fileName: string, product: string) => {
  const mdContents = matter.read(fileName, {
    delimiters: ["---", "---"],
    language: "yaml",
  });
  // `file` is what the search result links to, so it is the doc's path under
  // content/docs/<product>/ - including any folder it has been filed into.
  const slug = fileName
    .split(`/docs/${product}/`)
    .slice(-1)[0]
    .replace(/\.mdx$/, "");
  const body = mdContents.content;

  const title = mdContents.data.title;
  const plainText = await markdownToPlainText(body);

  return fitRecord({
    title: title,
    body: plainText,
    file: slug,
  });
};

const fetchDocData = async (globPattern: string, product: string) => {
  const allFiles = await getDocFileNames(globPattern);
  const promises = allFiles.map(async (fileName) => {
    const data = await getDocumentationData(fileName, product);
    return data;
  });

  const results = await Promise.all(promises);
  return results;
};

async function createIndices() {
  const appID = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_WRITE_API_KEY;
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
      // Docs live in folders, so recurse - but skip translations, which belong to
      // their own locale rather than this index.
      const globPattern = `./content/docs/${product}/**/*.mdx`;
      const docData = await fetchDocData(globPattern, product);
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
