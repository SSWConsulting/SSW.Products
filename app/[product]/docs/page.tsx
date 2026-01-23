import { notFound } from "next/navigation";
import client from "../../../tina/__generated__/client";
import { getLocale } from "../../../utils/i18n";
import DocPost from "./[slug]/page";
interface DocsIndex {
  params: Promise<{ product: string }>;
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
  return (
    sitePosts.data.docsConnection?.edges?.map((post) => ({
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

export default async function DocsIndex({ params }: DocsIndex) {
  const { product } = await params;
  const defaultSlug = "introduction";
  const locale = await getLocale();

  try {
    return <DocPost params={{ product, slug: defaultSlug }} locale={locale} />;
  } catch (error) {
    console.error("Error rendering doc post:", error);
    return notFound();
  }
}
