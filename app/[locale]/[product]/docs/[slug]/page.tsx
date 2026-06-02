import { getDocPost } from "@utils/fetchDocs";
import client from "@tina/__generated__/client";
import { setPageMetadata } from "@utils/setPageMetaData";
import DocPostClient from "./DocPostClient";
import getDocPageData from "@utils/pages/getDocPageData";
import ClientFallbackPage from "@app/client-fallback-page";
import NotFoundError from "@/errors/not-found";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

interface DocPostProps {
  params: Promise<{ locale: string; slug: string; product: string }>;
}

export async function generateMetadata({ params }: DocPostProps) {
  const { locale, product, slug } = await params;
  try {
    const docs = await getDocPost({ product, slug, locale });
    return setPageMetadata(docs?.docs?.seo, product, "Docs");
  } catch (error) {
    if (error instanceof NotFoundError) return {};
    throw error;
  }
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.docsConnection({});
  return (
    sitePosts.data.docsConnection?.edges?.map((post) => {
      const breadcrumbs = post?.node?._sys.breadcrumbs ?? [];
      return {
        locale: localeFromBreadcrumbs(breadcrumbs),
        product: breadcrumbs[0],
        slug: post?.node?._sys.filename,
      };
    }) || []
  );
}

export default async function DocPost({ params }: DocPostProps) {
  const { locale, slug, product } = await params;
  try {
    const documentData = await getDocPageData({ product, slug, locale });
    return <DocPostClient {...documentData} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
        <ClientFallbackPage
          product={product}
          relativePath={slug}
          query="getDocPageData"
          Component={DocPostClient}
        />
      );
    }
    throw error;
  }
}

export const revalidate = 3600;
