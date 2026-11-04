// Builds the docs search indices with Pagefind - one per product, written to
// public/pagefind/<product>/ so each site only searches its own docs.
//
// The docs pages are rendered per request (the locale comes from the request
// headers), so there is no static HTML for Pagefind to crawl. Instead each doc
// is added as a custom record straight from its .mdx source.
//
// Runs before `next dev` and `next build`, so the index always matches the
// content that is being served.

import fg from "fast-glob";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import * as pagefind from "pagefind";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const DOCS_DIR = "content/docs";
const OUTPUT_DIR = "public/pagefind";

const markdownToPlainText = async (body) => {
  const res = await unified()
    .use(remarkParse)
    .use(stripMarkdown)
    .use(remarkStringify)
    .process(body);
  return res.toString();
};

const buildProductIndex = async (product) => {
  // Translations live in a zh/ folder beside the English docs - they share the
  // English URLs, so indexing them would only add duplicate results.
  const files = await fg(`${DOCS_DIR}/${product}/**/*.mdx`, {
    ignore: ["**/zh/**"],
  });

  const { index, errors } = await pagefind.createIndex();
  if (!index) throw new Error(`Pagefind failed to start: ${errors.join(", ")}`);

  for (const file of files) {
    const { data, content } = matter.read(file);
    // The doc's path under content/docs/<product>/, including any folder it
    // has been filed into - the same slug its page is served at.
    const slug = file
      .slice(`${DOCS_DIR}/${product}/`.length)
      .replace(/\.mdx$/, "");
    const title = data.title ?? slug;
    const body = await markdownToPlainText(content);

    const { errors: recordErrors } = await index.addCustomRecord({
      url: `/docs/${slug}`,
      // The title goes in the content too, so searching for it finds the doc
      content: `${title}\n\n${body}`,
      language: "en",
      meta: { title },
    });
    if (recordErrors.length) {
      throw new Error(`Could not index ${file}: ${recordErrors.join(", ")}`);
    }
  }

  const outputPath = path.join(OUTPUT_DIR, product.toLowerCase());
  const { errors: writeErrors } = await index.writeFiles({ outputPath });
  if (writeErrors.length) {
    throw new Error(`Could not write ${outputPath}: ${writeErrors.join(", ")}`);
  }

  console.log(`✅ ${product}: indexed ${files.length} docs → ${outputPath}`);
};

const main = async () => {
  await rm(OUTPUT_DIR, { recursive: true, force: true });

  const products = (await readdir(DOCS_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  // One at a time - the indices share a single Pagefind service
  for (const product of products) {
    await buildProductIndex(product);
  }

  await pagefind.close();
};

main().catch(async (error) => {
  console.error("Failed to build the search indices:", error);
  await pagefind.close();
  process.exit(1);
});
