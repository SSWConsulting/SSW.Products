import { getDocPost, getDocsTableOfContents } from "@utils/fetchDocs";
import { notFound } from "next/navigation";
import client from "../../../../tina/__generated__/client";
import { DocsTableOfContents } from "../../../../tina/__generated__/types";
import { getLocale } from "../../../../utils/i18n";
import { setPageMetadata } from "../../../../utils/setPageMetaData";
import QueryProvider from "@comps/providers/QueryProvider";
import DocPostClient from "./DocPostClient";
import PaginationLinksClient from "./PaginationLinksClient";

interface DocPostProps {
  params: {
    slug: string;
    product: string;
  };
  locale?: string;
}

interface DocPostMetadataProps {
  params: {
    slug: string;
    product: string;
  };
}

export async function generateMetadata({ params }: DocPostMetadataProps) {
  const { product, slug } = params;
  const locale = await getLocale();
  const docs = await getDocPost(product, slug, locale);
  const metadata = setPageMetadata(docs?.docs?.seo, product, "Docs");
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

export default async function DocPost({ params, locale }: DocPostProps) {
  const { slug, product } = params;

  const currentLocale = locale || await getLocale();
  const documentData = await getDocPost(product, slug, currentLocale);
  const tableOfContentsData = await getDocsTableOfContents(
    product,
    currentLocale
  );

  const paginationData = getPaginationData(
    tableOfContentsData as DocsTableOfContents,
    slug
  );

  if (!documentData) {
    return notFound();
  }
  return (
    <QueryProvider>
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

      <DocPostClient
        query={documentData.query}
        variables={documentData.variables}
        pageData={{ docs: documentData.docs }}
        tableOfContentsData={tableOfContentsData as DocsTableOfContents}
      />
      <PaginationLinksClient
        prev={paginationData.prev}
        next={paginationData.next}
      />
    </QueryProvider>
  );
}

// Add revalidation - page wouldn't update although GraphQL was updated. TODO: remove this once @wicksipedia created the global revalidation route.
export const revalidate = 600;

const getPaginationData = (
  tableOfContentsData: DocsTableOfContents,
  currentSlug: string
) => {
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
};
