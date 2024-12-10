import { notFound } from "next/navigation";
import InteractiveBackground from "../../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../../components/shared/NavBarServer";
import FooterServer from "../../../../components/shared/FooterServer";
import client from "../../../../tina/__generated__/client";
import DocPostClient from "../../../../components/shared/DocPostClient";

interface DocPostProps {
  params: {
    slug: string;
    product: string;
  };
}

export default async function DocPost({ params }: DocPostProps) {
  const { slug, product } = params;

  const data = await getDocPost(product, slug);
  if (!data) {
    return notFound();
  }

  

  return (
    <div className="flex flex-col min-h-screen">
      <InteractiveBackground />
      <NavBarServer product={product} />

      <div className="flex-grow">
        <DocPostClient
          title={data.title}
          date={data.date || ""}
          body={data.body}
          filename={data._sys.filename || ""}
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

    const docs = res.data?.docs;

    if (!docs) {
      return null;
    }

    return docs;
  } catch (error) {
    console.error("Error fetching doc post:", error);
    return null;
  }
}
