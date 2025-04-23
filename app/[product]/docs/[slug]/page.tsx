import { notFound } from "next/navigation";


import DocPostClient from "./DocPostClient";
import FooterServer from "../../../../components/shared/FooterServer";
import NavBarServer from "../../../../components/shared/NavBarServer";
import client from "../../../../tina/__generated__/client";
import { Docs } from "../../../../tina/__generated__/types";
import { setPageMetadata } from "../../../../utils/setPageMetaData";
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

export default async function DocPost({ params }: DocPostProps) {
  const { slug, product } = params;
  const documentData = await getDocPost(product, slug);
  const tableOfContentsData = await getDocsTableOfContents(product);

  if (!documentData) {
    return notFound();
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_3fr] max-w-[90rem] mx-auto min-h-screen ">
        {/* LEFT COLUMN 1/3 */}
        <div className="w-full text-white lg:pt-20 md:pt-20 mt-20 ">
          <TableOfContentsClient tableOfContentsData={tableOfContentsData} />
        </div>

        {/* RIGHT COLUMN 2/3 */}
        <div className="flex-grow p-4 lg:pt-20 md:pt-20 mt-20 ">
          <DocPostClient
            query={documentData.query}
            variables={documentData.variables}
            pageData={{ docs: documentData.docs }}
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
