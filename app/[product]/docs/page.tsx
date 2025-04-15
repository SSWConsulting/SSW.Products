import { notFound } from "next/navigation";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import DocsIndexClient from "../../../components/shared/DocsIndexClient";
import FooterServer from "../../../components/shared/FooterServer";
import NavBarServer from "../../../components/shared/NavBarServer";
import client from "../../../tina/__generated__/client";
import { getDocsForProduct } from "../../../utils/fetchDocs";

interface BlogIndex {
  params: { product: string };
}

export async function generateMetadata({ params }: BlogIndex) {
  const { product } = params;
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

export default async function DocsIndex({ params }: BlogIndex) {
  const { product } = params;

  try {
    const docs = await getDocsForProduct(product);

    if (!docs) {
      return notFound();
    }

    return (
      <div className="flex flex-col min-h-screen">
        <InteractiveBackground />
        <NavBarServer product={product} />

        <div className="flex-grow">
          {docs.data !== undefined && (
            <DocsIndexClient data={docs.data} product={product} />
          )}
        </div>

        <FooterServer product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    return notFound();
  }
}
