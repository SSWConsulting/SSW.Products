export function getGoogleTagId(product: string) {
  const productList = process.env.NEXT_PUBLIC_PRODUCT_LIST
    ? JSON.parse(process.env.NEXT_PUBLIC_PRODUCT_LIST)
    : [];

  const googleTagId = productList.find(
    (prod: any) => prod.product === product
  )?.googleTagId;

  return googleTagId ? googleTagId : process.env.DEFAULT_GOOGLE_TAG_ID;
}
