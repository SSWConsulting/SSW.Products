import { Product } from "@/types/product-list";

export const getDomainForTenant = (product: string) => {
  if (!process.env.NEXT_PUBLIC_PRODUCT_LIST)
    throw new Error("NEXT_PUBLIC_PRODUCT_LIST is not defined");
  const productList: Product[] = JSON.parse(
    process.env.NEXT_PUBLIC_PRODUCT_LIST
  );

  for (const item of productList) {
    if (item.product === product) {
      return item.domain;
    }
  }
};
