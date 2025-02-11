import { notFound } from "next/navigation";
import InteractiveBackground from "../../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../../components/shared/NavBarServer";
import FooterServer from "../../../../components/shared/FooterServer";
import client from "../../../../tina/__generated__/client";
import DocPostClient from "../../../../components/shared/DocPostClient";
import { Docs } from "../../../../tina/__generated__/types";

interface DocPostProps {
  params: {
    slug: string;
    product: string;
  };
}

export default async function DocPost({ params }: DocPostProps) {
  const { slug, product } = params;

  const documentData = await getDocPost(product, slug);
  if (!documentData) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InteractiveBackground />
      <NavBarServer product={product} />

      <div className="flex-grow">
        <DocPostClient
          query={documentData.query}
          variables={documentData.variables}
          pageData={{ docs: documentData.docs }} 
        />
      </div>

      <FooterServer product={product} />
    </div>
  );
}

async function getDocPost(product: string, slug: string) {
  try {
    const res = await client.queries.docs({
      relativePath: `${product}/${slug}.mdx`,
    });

    if (!res?.data?.docs) {
      return null;
    }

    return {
      query: res.query,
      variables: res.variables,
      docs: res.data.docs as Docs,
    };
  } catch (error) {
    console.error("Error fetching doc post:", error);
    return null;
  }
}
