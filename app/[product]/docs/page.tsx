import { notFound } from "next/navigation";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../components/shared/NavBarServer";
import FooterServer from "../../../components/shared/FooterServer";
import DocsIndexClient from "../../../components/shared/DocsIndexClient";
import { getDocsForProduct } from "../../../utils/fetchDocs";

interface BlogIndex {
  params: { product: string };
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
          <DocsIndexClient
            query={docs.query}
            data={docs.data}
            product={product}
          />
        </div>

        <FooterServer product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    return notFound();
  }
}
