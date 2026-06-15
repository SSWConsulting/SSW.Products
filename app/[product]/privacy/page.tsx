import { Metadata } from "next";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import PrivacyPolicyClient from "../../../components/shared/PrivacyPolicyClient";
import { getLocale, getPrivacyWithFallback } from "../../../utils/i18n";
import { setPageMetadata } from "../../../utils/setPageMetaData";

interface PrivacyPolicyProps {
  params: Promise<{
    product: string;
  }>;
}

export async function generateMetadata({
  params,
}: PrivacyPolicyProps): Promise<Metadata> {
  const { product } = await params;
  const locale = await getLocale();
  const res = await getPrivacyWithFallback(product, locale);

  const privacy = res.data.privacy;
  const metadata = setPageMetadata(privacy.seo, product);

  return metadata;
}

export default async function PrivacyPolicy({ params }: PrivacyPolicyProps) {
  const { product } = await params;
  const locale = await getLocale();
  const res = await getPrivacyWithFallback(product, locale);

  return (
    <div className="flex flex-col min-h-screen">
      <InteractiveBackground />
      <div className="grow">
        <PrivacyPolicyClient {...res} />
      </div>
    </div>
  );
}
