import { tenantHasPrivacyPolicy } from "@utils/privacy";
import { getFooterWithFallback } from "@utils/i18n";
import FooterContent from "./FooterContent";

interface FooterServerProps {
  product: string;
  locale?: string;
}

export default async function FooterServer({ product, locale }: FooterServerProps) {
  const hasPrivacyPolicy = await tenantHasPrivacyPolicy(product);
  const result = await getFooterWithFallback(product, locale);
  
  return (
    <FooterContent hasPrivacyPolicy={hasPrivacyPolicy} results={result?.data || null} locale={locale} />
  );
}
