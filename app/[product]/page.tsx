import HomePageClient from "../../components/shared/HomePageClient";
import client from "../../tina/__generated__/client";
import { setPageMetadata } from "../../utils/setPageMetaData";
import { headers } from 'next/headers';

interface ProductPageProps {
  params: { product: string };
}

function getLocaleFromPath(): string {
  const headersList = headers();
  return headersList.get('x-language') || 'en';
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { product } = params;
  const locale = getLocaleFromPath();
  const productData = await getPage(product, locale);
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
  const locale = getLocaleFromPath();

  const productData = await getPage(product, locale);
  const relativePath = locale === 'zh' ? `${product}/zh/home.json` : `${product}/home.json`;
  
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

async function getPage(product: string, locale: string = 'en') {
  try {
    let relativePath: string;
    
    if (locale === 'zh') {
      relativePath = `${product}/zh/home.json`;
      
      try {
        const res = await client.queries.pages({ relativePath });
        return {
          query: res.query,
          data: res.data,
          variables: res.variables,
        };
      } catch (error) {
        console.log(`Chinese version not found, falling back to English for ${product}`);
      }
    }
    
    // Default English version
    relativePath = `${product}/home.json`;
    const res = await client.queries.pages({ relativePath });
    return {
      query: res.query,
      data: res.data,
      variables: res.variables,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS data:", error);
    throw new Error(`Could not fetch data for ${product}/home.json`);
  }
}
