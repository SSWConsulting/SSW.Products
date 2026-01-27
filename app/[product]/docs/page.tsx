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
    title: `${product} Docs`,
    description: `Find out more about ${product}, guides and documentation`,
    openGraph: {
      title: `${product} Docs`,
      description: `Find out more about ${product}, guides and documentation`,
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

  try {
    return <DocPost params={Promise.resolve({ product, slug: defaultSlug })} />;
  } catch (error) {
    console.error("Error rendering doc post:", error);
    return notFound();
  }
}
