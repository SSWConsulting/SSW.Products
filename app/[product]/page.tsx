import HomePageClient from "../../components/shared/HomePageClient";
import client from "../../tina/__generated__/client";
import { setPageMetadata } from "../../utils/setPageMetaData";
import { getLocale, getPageWithFallback, getRelativePath } from "../../utils/i18n";

interface ProductPageProps {
  params: Promise<{ product: string }>;
}


export async function generateMetadata({ params }: ProductPageProps) {
  const { product } = await params;
  const locale = await getLocale();
  const productData = await getPageWithFallback({product, filename: 'home', locale});
  const metadata = setPageMetadata(productData.data?.pages?.seo, product);
  return metadata;
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.pagesConnection({});
  return (
    sitePosts.data.pagesConnection?.edges?.map((post) => ({
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const {product} = await params;
  const locale = await getLocale();

  const productData = await getPageWithFallback({product, filename: 'home', locale});
  const relativePath = getRelativePath(product, 'home', locale);
  
  return (
    <div>
      <HomePageClient
        query={productData.query}
        data={productData.data}
        variables={{ relativePath }}
      />
    </div>
  );
}

