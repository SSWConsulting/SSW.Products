import client from "../../tina/__generated__/client";
import HomePageClient from "../../components/shared/HomePageClient";
import NavBarServer from "../../components/shared/NavBarServer";
import FooterServer from "../../components/shared/FooterServer";
import InteractiveBackground from "../../components/shared/Background/InteractiveBackground";

interface ProductPageProps {
  params: { product: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = params.product;

  const productData = await getPage(product);

  return (
    <div>
      <NavBarServer product={product} />
      <HomePageClient
        query={productData.query}
        data={productData.data}
        variables={{ relativePath: `${product}/home.json` }}
      />
      <FooterServer product={product} />
    </div>
  );
}

async function getPage(product: string) {
  try {
    const res = await client.queries.pages({
      relativePath: `${product}/home.json`,
    });
    return {
      query: res.query,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS data:", error);
    throw new Error(`Could not fetch data for ${product}/home.json`);
  }
}
