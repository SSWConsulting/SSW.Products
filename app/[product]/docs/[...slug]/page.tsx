import { findMovedDocSlug, getDocPost } from "@utils/fetchDocs";
import { permanentRedirect } from "next/navigation";
import client from "../../../../tina/__generated__/client";
import { getLocale, withLocalePrefix } from "../../../../utils/i18n";
import { docSlugFromBreadcrumbs } from "../../../../utils/docPath";
import { setPageMetadata } from "../../../../utils/setPageMetaData";
import DocPostClient from "./DocPostClient";
import getDocPageData from "@utils/pages/getDocPageData";
import ClientFallbackPage from "../../../client-fallback-page";
import NotFoundError from "@/errors/not-found";

interface DocPostProps {
  params: Promise<{
    slug: string[];
    product: string;
  }>;
}

interface DocPostMetadataProps {
  params: Promise<{
    slug: string[];
    product: string;
  }>;
}

export async function generateMetadata({ params }: DocPostMetadataProps) {
  const { product, slug } = await params;
  try {
    const locale = await getLocale();
    const docs = await getDocPost({ product, slug: slug.join("/"), locale });
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
  const params: { slug: string[]; product: string }[] = [];
  const seen = new Set<string>();

  for (const post of sitePosts.data.docsConnection?.edges ?? []) {
    const breadcrumbs = post?.node?._sys.breadcrumbs;
    const slug = docSlugFromBreadcrumbs(breadcrumbs);
    if (!breadcrumbs?.length || !slug) continue;

    // A zh doc serves the same URL as the English one it translates - the locale
    // comes from the request headers - so it must not be emitted a second time.
    const key = `${breadcrumbs[0]}/${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);

    params.push({ product: breadcrumbs[0], slug: slug.split("/") });
  }

  return params;
}

export default async function DocPost({ params }: DocPostProps) {
  const { slug: slugSegments, product } = await params;
  const slug = slugSegments.join("/");
  const locale = await getLocale();
  try {
    const documentData = await getDocPageData({product, slug, locale});
    return <DocPostClient {...documentData} />;
  }
  catch (error) {
    if(error instanceof NotFoundError){
        // The doc may just have been filed into a folder since this URL was
        // published. Send readers (and search engines) to where it lives now
        // rather than showing them a 404.
        const movedSlug = await findMovedDocSlug(product, slug);
        if (movedSlug) {
          permanentRedirect(await withLocalePrefix(`/docs/${movedSlug}`, locale));
        }

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
