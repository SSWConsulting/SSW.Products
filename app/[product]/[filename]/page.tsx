import HomePageClient from "../../../components/shared/HomePageClient";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";
import { getLocale, getPageWithFallback, getRelativePath } from "../../../utils/i18n";
import getPageData from "@utils/pages/getPageData";
import NotFoundError from "@/errors/not-found";
import ClientFallbackPage from "../../client-fallback-page";
import { notFound } from "next/navigation";

export const dynamic = 'force-static';
interface FilePageProps {
  params: Promise<{ product: string; filename: string }>;
}


export async function generateMetadata({ params }: FilePageProps) {
  
  const { product, filename } = await params;
  try {
  const locale = await getLocale();
  const fileData = await getPageWithFallback({product, filename, locale, revalidate: 3600, branch: "main"});
  const metadata = setPageMetadata(fileData.data?.pages?.seo, product);
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
  const sitePosts = await client.queries.pagesConnection({});
  return (
    sitePosts.data.pagesConnection?.edges?.map((post) => ({
      filename: post?.node?._sys.filename,
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}
export default async function FilePage({ params }: FilePageProps) {  
  const { product, filename } = await params;
  try {
  const {data, query, relativePath} = await getPageData(product, filename);
  return (
      <HomePageClient
        query={query}
        data={data}
        variables={{ relativePath }}
      />
    );
  }
  catch(error) 
  {
    if(error instanceof NotFoundError){
        return <ClientFallbackPage 
          product={product} 
          relativePath={filename}
          query="getPageData"
          Component={HomePageClient} />;
    }
    notFound();
  }
}

// Content publishes via TinaCMS git commits that trigger a redeploy (which
// rebuilds these pages anyway), so sub-minute freshness was redundant. 1h TTL
// cuts time-based regenerations ~60x.
export const revalidate = 3600;
