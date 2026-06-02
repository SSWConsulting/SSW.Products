import { notFound } from "next/navigation";
import client from "@tina/__generated__/client";
import DocPost from "./[slug]/page";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

interface DocsIndex {
  params: Promise<{ locale: string; product: string }>;
}

export async function generateMetadata({ params }: DocsIndex) {
  const { product } = await params;
  return {
    title: `${product} - Docs - Guides, References, and Resources`,
    description: `Find official documentation, guides, references, and resources to help you get the most out of ${product}.`,
    openGraph: {
      title: `${product} - Docs - Guides, References, and Resources`,
      description: `Find official documentation, guides, references, and resources to help you get the most out of ${product}.`,
      images: `./public/default-images/${product}-default.png`,
    },
  };
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.docsConnection({});
  const seen = new Set<string>();
  const params: { locale: string; product: string }[] = [];
  for (const edge of sitePosts.data.docsConnection?.edges ?? []) {
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

export default async function DocsIndex({ params }: DocsIndex) {
  const { locale, product } = await params;
  const defaultSlug = "introduction";
  try {
    return <DocPost params={Promise.resolve({ locale, product, slug: defaultSlug })} />;
  } catch (error) {
    console.error("Error rendering doc post:", error);
    return notFound();
  }
}
