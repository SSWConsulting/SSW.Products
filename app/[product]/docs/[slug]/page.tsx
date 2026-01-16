import { getDocPost } from "@utils/fetchDocs";
import client from "../../../../tina/__generated__/client";
import { getLocale } from "../../../../utils/i18n";
import { setPageMetadata } from "../../../../utils/setPageMetaData";
import DocPostClient from "./DocPostClient";
import getDocPageData from "@utils/pages/getDocPageData";
import ClientFallbackPage from "../../../client-fallback-page";
import NotFoundError from "@/errors/not-found";

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
  try {
    const locale = await getLocale();
    const docs = await getDocPost({product, slug, locale});
    const metadata = setPageMetadata(docs?.docs?.seo, product, "Docs");
    return metadata;
  }
  catch(error) {
    if(error instanceof NotFoundError){
      return {};
    }
    throw error;
  }
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

export default async function DocPost({ params, locale }: DocPostProps) {
  const { slug, product } = params;
  try {
    const documentData = await getDocPageData({product, slug, locale});
    return <DocPostClient {...documentData} />;
  }
  catch (error) {
    if(error instanceof NotFoundError){
        return <ClientFallbackPage 
          product={product} 
          relativePath={slug}
          query="getDocPageData"
          Component={DocPostClient} />;
    }
    throw error;
  }
}

// Add revalidation - page wouldn't update although GraphQL was updated. TODO: remove this once @wicksipedia created the global revalidation route.
export const revalidate = 600;

