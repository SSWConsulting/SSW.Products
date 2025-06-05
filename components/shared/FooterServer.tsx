import { tenantHasPrivacyPolicy } from "@utils/privacy";
import client from "../../tina/__generated__/client";
import FooterContent from "./FooterContent";

interface FooterServerProps {
  product: string;
}

export default async function FooterServer({ product }: FooterServerProps) {
  let footerData = null;
  const hasPrivacyPolicy = await tenantHasPrivacyPolicy(product);

  try {
    const { data } = await client.queries.footer({
      relativePath: `${product}/${product}-Footer.json`,
    });
    footerData = data;
  } catch {
    // We don't care about this... for the moment
  }
  return (
    <FooterContent hasPrivacyPolicy={hasPrivacyPolicy} results={footerData} />
  );
}
