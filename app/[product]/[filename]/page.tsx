import CustomizeableBackground from "../../../components/shared/Background/CustomizeableBackground";
import HomePageClient from "../../../components/shared/HomePageClient";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";
import { getLocale, getPageWithFallback, getRelativePath } from "../../../utils/i18n";
import getPageData from "@utils/pages/getPageData";

interface FilePageProps {
  params: Promise<{ product: string; filename: string }>;
}


export async function generateMetadata({ params }: FilePageProps) {
  
  const { product, filename } = await params;
  const locale = await getLocale();
  const fileData = await getPageWithFallback(product, filename, locale, {
    fetchOptions: {
      next: {
        revalidate: 10,
      },
    },
  });
  const metadata = setPageMetadata(fileData.data?.pages?.seo, product);
  return metadata;
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
  const {fileData, relativePath} = await getPageData(product, filename);
  return (
    <>
     
      <HomePageClient
        query={fileData.query}
        data={fileData.data}
        variables={{ relativePath }}
      />

    </>
  );
}


export const revalidate = 60;
