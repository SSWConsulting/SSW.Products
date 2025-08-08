import HomePageClient from "../../components/shared/HomePageClient";
import client from "../../tina/__generated__/client";
import { setPageMetadata } from "../../utils/setPageMetaData";
import { getLocale, getPageWithFallback, getRelativePath } from "../../utils/i18n";

interface ProductPageProps {
  params: { product: string };
}


export async function generateMetadata({ params }: ProductPageProps) {
  const { product } = params;
  const locale = getLocale();
  const productData = await getPageWithFallback(product, 'home', locale);
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
  const product = params.product;
  const locale = getLocale();

  const productData = await getPageWithFallback(product, 'home', locale);
  const relativePath = getRelativePath(product, 'home', locale);
  
  return (
    <div>
      <HomePageClient
        query={productData.query}
        data={productData.data}
        variables={{ relativePath }}
      />
      {productData?.data.pages.seo?.googleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `${
              productData?.data.pages.seo?.googleStructuredData ?? {}
            }`,
          }}
        />
      )}
    </div>
  );
}

