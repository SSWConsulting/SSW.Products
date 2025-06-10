import { Product } from "@/types/product-list";
import client from "@tina/__generated__/client";
import NotFoundClient from "./not-found/not-found-client";
export default async function NotFound() {
  const products = process.env.NEXT_PUBLIC_PRODUCT_LIST;
  if (!products) {
    throw Error(
      "NEXT_PUBLIC_PRODUCT_LIST is not defined in the environment variables."
    );
  }
  const productList = JSON.parse(products) as Product[]; // Ensure this is used somewhere or remove it if not needed

  const productStrings = productList.map((product) => product.product);

  const productQueries = await Promise.all(
    productList.map((product) => {
      return client.queries.notFound({
        relativePath: `${product.product}/index.mdx`,
      });
    })
  );

  const productDictionary = productStrings.reduce((acc, product, index) => {
    acc[product] = productQueries[index];
    return acc;
  }, {} as Record<string, (typeof productQueries)[number]>);

  return <NotFoundClient notFoundDictionary={productDictionary} />;
}
