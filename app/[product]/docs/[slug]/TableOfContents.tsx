// app/[product]/docs/[slug]/TableOfContents.tsx
import client from "@tina/__generated__/client";
import TableOfContentsClient from "./TableOfContentsClient";

export default async function TableOfContents({
  product,
}: {
  product: string;
}) {
  // console.log("Fetching Table of Contents for product:", product);
  // Fetch the data on the server
  const tableOfContentsData = await getDocsTableOfContents(product);
  return (
    <TableOfContentsClient
      activeItem={""}
      tableOfContentsData={tableOfContentsData as any}
    />
  );
}
async function getDocsTableOfContents(product: string) {
  const res = await client.queries.docsTableOfContents({
    relativePath: `${product}/toc.mdx`,
  });
  return res.data.docsTableOfContents;
}
