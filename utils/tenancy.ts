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

// True only when `host` is a tenant's own canonical domain. Used to decide
// whether robots.txt should advertise the sitemap: the sitemap's <loc>s are
// built from getDomainForTenant(product), so on a non-canonical host (e.g. a
// .cn mirror or *.vercel.app staging) they'd point at a different host and
// crawlers would treat them as unverified.
export const isCanonicalTenantHost = (
  host: string | null | undefined
): boolean => {
  if (!host || !process.env.NEXT_PUBLIC_PRODUCT_LIST) return false;
  const productList: Product[] = JSON.parse(
    process.env.NEXT_PUBLIC_PRODUCT_LIST
  );
  return productList.some((item) => item.domain === host);
};
