import client from "@tina/__generated__/client";
import { Docs, DocsTableOfContents } from "@tina/__generated__/types";
import TableOfContents from "./[slug]/TableOfContents";

import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationLink {
  title: string;
  slug: string;
}

function PaginationLinks({
  prev,
  next,
  product,
}: {
  prev: PaginationLink | null;
  next: PaginationLink | null;
  product: string;
}) {
  return (
    <div className="flex lg:justify-between mt-12 py-4  rounded-lg gap-4 overflow-hidden">
      {prev ? (
        <Link
          href={`/${product}/docs/${prev.slug}`}
          className="flex gap-2 items-center text-white/60 hover:text-white transition-all duration-300"
        >
          <FaArrowLeft />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div></div>
      )}

      {next ? (
        <Link
          href={`/${product}/docs/${next.slug}`}
          className="flex gap-2 text-end items-center text-white/60 hover:text-white transition-all duration-300 "
        >
          <span>{next.title}</span>
          <FaArrowRight />
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}

interface DocPostProps {
  params: {
    product: string;
  };
}

async function getDocPost(product: string, slug: string) {
  try {
    const res = await client.queries.docs({
      relativePath: `${product}/${slug}.mdx`,
    });

    if (!res?.data?.docs) {
      return null;
    }

    return {
      query: res.query,
      variables: res.variables,
      docs: res.data.docs as Docs,
    };
  } catch (error) {
    console.error("Error fetching doc post:", error);
    return null;
  }
}

// async function getDocsTableOfContents(product: string) {
//   const res = await client.queries.docsTableOfContents({
//     relativePath: `${product}/toc.mdx`,
//   });
//   return res.data.docsTableOfContents;
// }

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
    product: string;
  };
}) => {
  // const { slug, product } = params;
  // const documentData = await getDocPost(product, slug);
  // const tableOfContentsData = await getDocsTableOfContents(product);
  // const paginationData = getPaginationData(
  //   tableOfContentsData as DocsTableOfContents,
  //   slug
  // );
  // if (!documentData) {
  //   return notFound();
  // }

  return (
    <>
      <div className="grid grid-cols-1 h-full md:grid-cols-[1.25fr_3fr] lg:grid-cols-[1fr_3fr] max-w-360 mx-auto">
        {/* LEFT COLUMN 1/3 */}
        <div className=" max-h-[calc(100vh-13rem)] mt-20 hidden md:block py-8 bg-gray-darkest max-w-[calc(100%_-_2rem)]  max-w-offset-container-16 mb-8 rounded-lg left-4 top-44 text-white self-start px-6  overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-ssw-charcoal)_transparent] sticky">
          <TableOfContents
            product={"YakShaver"}
            // tableOfContentsData={tableOfContentsData as any}
          />
        </div>

        {/* RIGHT COLUMN 2/3 */}
        <div className="grow px-4 sm:pt-20 ">
          {children}
          {/* <PaginationLinks
            prev={paginationData.prev}
            next={paginationData.next}
            product={product}
          /> */}
        </div>
      </div>
      {/* {documentData?.docs?.seo?.googleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              documentData?.docs?.seo?.googleStructuredData ?? {}
            ),
          }}
        />
      )} */}
    </>
  );
};
export default RootLayout;

function getPaginationData(
  tableOfContentsData: DocsTableOfContents,
  currentSlug: string
): { prev: PaginationLink | null; next: PaginationLink | null } {
  const result: { prev: PaginationLink | null; next: PaginationLink | null } = {
    prev: null,
    next: null,
  };

  const allDocs: PaginationLink[] = [];
  tableOfContentsData.parentNavigationGroup?.forEach((group: any) => {
    if (!group?.items) return;

    group.items.forEach((item: any) => {
      if (item.slug && item.slug._sys && item.slug._sys.filename) {
        allDocs.push({
          title: item.title || "",
          slug: item.slug._sys.filename,
        });
      }
    });
  });
  const currentIndex = allDocs.findIndex((doc) => doc.slug === currentSlug);
  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      result.prev = allDocs[currentIndex - 1];
    }

    if (currentIndex < allDocs.length - 1) {
      result.next = allDocs[currentIndex + 1];
    }
  }

  return result;
}
