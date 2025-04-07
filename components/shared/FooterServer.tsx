import client from "../../tina/__generated__/client";
import FooterClient from "./FooterClient";

interface FooterServerProps {
  product: string;
}

const getHasPrivacyPolicy = async (product: string) => {
  console.log("product", product);
  try {
    const res = await client.queries.privacy({
      relativePath: `${product}/index.mdx`,
    });
    return Boolean(res);
  } catch {
    return false;
  }
};

export default async function FooterServer({ product }: FooterServerProps) {
  let footerData = null;
  const hasPrivacyPolicy = await getHasPrivacyPolicy(product);

  try {
    const { data } = await client.queries.footer({
      relativePath: `${product}/${product}-Footer.json`,
    });
    footerData = data;
  } catch {
    // We don't care about this... for the moment
  }
  return (
    <FooterClient hasPrivacyPolicy={hasPrivacyPolicy} results={footerData} />
  );
}
