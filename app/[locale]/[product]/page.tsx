import HomePageClient from "@comps/shared/HomePageClient";
import ProductBackground from "@comps/shared/ProductBackground";
import client from "@tina/__generated__/client";
import { setPageMetadata } from "@utils/setPageMetaData";
import { getPageWithFallback, getRelativePath } from "@utils/i18n";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

interface ProductPageProps {
  params: Promise<{ locale: string; product: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, product } = await params;
  const productData = await getPageWithFallback({ product, filename: "home", locale });
  return setPageMetadata(productData.data?.pages?.seo, product);
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.pagesConnection({});
  const seen = new Set<string>();
  const params: { locale: string; product: string }[] = [];
  for (const edge of sitePosts.data.pagesConnection?.edges ?? []) {
    const breadcrumbs = edge?.node?._sys.breadcrumbs ?? [];
    const product = breadcrumbs[0];
    if (!product) continue;
    const locale = localeFromBreadcrumbs(breadcrumbs);
    const key = `${locale}/${product}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ locale, product });
  }
  return params;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, product } = await params;
  const productData = await getPageWithFallback({ product, filename: "home", locale });
  const relativePath = getRelativePath(product, "home", locale);

  return (
    <div>
      <ProductBackground product={product} />
      <HomePageClient query={productData.query} data={productData.data} variables={{ relativePath }} />
    </div>
  );
}

export const revalidate = 3600;
