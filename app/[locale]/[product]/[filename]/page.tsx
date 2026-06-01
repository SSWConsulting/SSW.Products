import HomePageClient from "@comps/shared/HomePageClient";
import client from "@tina/__generated__/client";
import { setPageMetadata } from "@utils/setPageMetaData";
import { getPageWithFallback } from "@utils/i18n";
import getPageData from "@utils/pages/getPageData";
import NotFoundError from "@/errors/not-found";
import ClientFallbackPage from "@app/client-fallback-page";
import { notFound } from "next/navigation";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

export const dynamic = "force-static";

interface FilePageProps {
  params: Promise<{ locale: string; product: string; filename: string }>;
}

export async function generateMetadata({ params }: FilePageProps) {
  const { locale, product, filename } = await params;
  try {
    const fileData = await getPageWithFallback({ product, filename, locale, revalidate: 3600, branch: "main" });
    return setPageMetadata(fileData.data?.pages?.seo, product);
  } catch (error) {
    if (error instanceof NotFoundError) return {};
    throw error;
  }
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.pagesConnection({});
  return (
    sitePosts.data.pagesConnection?.edges?.map((post) => {
      const breadcrumbs = post?.node?._sys.breadcrumbs ?? [];
      return {
        locale: localeFromBreadcrumbs(breadcrumbs),
        product: breadcrumbs[0],
        filename: post?.node?._sys.filename,
      };
    }) || []
  );
}

export default async function FilePage({ params }: FilePageProps) {
  const { locale, product, filename } = await params;
  try {
    const { data, query, relativePath } = await getPageData(product, filename, locale);
    return <HomePageClient query={query} data={data} variables={{ relativePath }} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
        <ClientFallbackPage
          product={product}
          relativePath={filename}
          query="getPageData"
          Component={HomePageClient}
        />
      );
    }
    notFound();
  }
}

export const revalidate = 3600;
