// app/[product]/docs/[slug]/TableOfContents.tsx
import { getDocsTableOfContents } from "@utils/fetchDocs";
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
