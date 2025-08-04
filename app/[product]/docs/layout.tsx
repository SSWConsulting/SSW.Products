import * as SearchBox from "@comps/search/SearchBox";
import { DocsTableOfContents } from "@tina/__generated__/types";
import { getDocsTableOfContents } from "@utils/fetchDocs";
import TableOfContentsClient from "./[slug]/TableOfContentsClient";

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    product: string;
  };
}) => {
  const tableOfContentsData = await getDocsTableOfContents(params.product);
  return (
    <>
      <SearchBox.Root index={tableOfContentsData.algoliaSearchIndex!}>
        <div className="grid grid-cols-1 h-full  md:grid-cols-[1.25fr_3fr] lg:grid-cols-[1fr_3fr] max-w-360 mx-auto">
          {/* LEFT COLUMN 1/3 */}
          <div className=" max-h-[calc(100vh-13rem)] mt-20 hidden md:block py-8 bg-gray-darkest max-w-[calc(100%_-_2rem)] mb-8 rounded-lg left-4 top-44 text-white self-start px-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-ssw-charcoal)_transparent] sticky">
            <TableOfContentsClient
              tableOfContentsData={tableOfContentsData as DocsTableOfContents}
            />
          </div>

          {/* RIGHT COLUMN 2/3 */}
          <div className="grow pl-4 pr-4 md:pr-12 pt-0 md:pt-20">{children}</div>
        </div>
      </SearchBox.Root>
    </>
  );
};
export default RootLayout;
