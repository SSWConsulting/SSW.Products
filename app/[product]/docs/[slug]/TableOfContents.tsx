import { getDocsTableOfContents } from "@utils/fetchDocs";
import TableOfContentsClient from "./TableOfContentsClient";

export default async function TableOfContents({
  product,
}: {
  product: string;
}) {
  const tableOfContentsData = await getDocsTableOfContents(product);
  return (
    <TableOfContentsClient
      activeItem={""}
      tableOfContentsData={tableOfContentsData as any}
    />
  );
}
