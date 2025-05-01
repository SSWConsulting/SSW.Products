import Link from "next/link";
import { notFound } from "next/navigation";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FooterServer from "../../../../components/shared/FooterServer";
import client from "../../../../tina/__generated__/client";
import { Docs } from "../../../../tina/__generated__/types";
import { setPageMetadata } from "../../../../utils/setPageMetaData";
import DocPostClient from "./DocPostClient";
import TableOfContentsClient from "./TableOfContentsClient";

interface DocPostProps {
  params: {
    slug: string;
    product: string;
  };
}

export async function generateMetadata({ params }: DocPostProps) {
  const { product, slug } = params;
  const docs = await getDocPost(product, slug);
  const metadata = setPageMetadata(docs?.docs?.seo, product);
  return metadata;
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.docsConnection({});
  return (
    sitePosts.data.docsConnection?.edges?.map((post) => ({
      slug: post?.node?._sys.filename,
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

interface PaginationLink {
  title: string;
  slug: string;
}

function getPaginationData(
  tableOfContentsData: any,
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
    <div className="flex pt-navBarHeight-mobile sm:pt-navBarHeight lg:justify-between mt-12 py-4  rounded-lg gap-4 overflow-hidden">
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

export default async function DocPost({ params }: DocPostProps) {
  const { slug, product } = params;
  const documentData = await getDocPost(product, slug);
  const tableOfContentsData = await getDocsTableOfContents(product);

  if (!documentData) {
    return notFound();
  }

  const paginationData = getPaginationData(tableOfContentsData as any, slug);

  return (
    <>
      <div className="grid grid-cols-1 pt-navBarHeight-mobile sm:pt-navBarHeight md:grid-cols-[1.25fr_3fr] lg:grid-cols-[1fr_3fr] max-w-[90rem] mx-auto min-h-screen">
        {/* LEFT COLUMN 1/3 */}
        <div className="hidden md:block w-full sm:pt-20 text-white sticky top-10 self-start max-h-screen overflow-y-auto">
          <TableOfContentsClient
            tableOfContentsData={tableOfContentsData as any}
          />
        </div>

        {/* RIGHT COLUMN 2/3 */}
        <div className="flex-grow px-4 sm:pt-20 ">
          <DocPostClient
            query={documentData.query}
            variables={documentData.variables}
            pageData={{ docs: documentData.docs }}
            tableOfContentsData={tableOfContentsData as any}
          />
          <PaginationLinks
            prev={paginationData.prev}
            next={paginationData.next}
            product={product}
          />
        </div>
      </div>
      <FooterServer product={product} />
      {documentData?.docs?.seo?.googleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              documentData?.docs?.seo?.googleStructuredData ?? {}
            ),
          }}
        />
      )}
    </>
  );
}

// Add revalidation - page wouldn't update although GraphQL was updated. TODO: remove this once @wicksipedia created the global revalidation route.
export const revalidate = 600;

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

async function getDocsTableOfContents(product: string) {
  const res = await client.queries.docsTableOfContents({
    relativePath: `${product}/toc.mdx`,
  });
  return res.data.docsTableOfContents;
}
