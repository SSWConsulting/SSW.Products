import { Metadata } from "next";
import InteractiveBackground from "@comps/shared/Background/InteractiveBackground";
import PrivacyPolicyClient from "@comps/shared/PrivacyPolicyClient";
import { getPrivacyWithFallback } from "@utils/i18n";
import { setPageMetadata } from "@utils/setPageMetaData";

interface PrivacyPolicyProps {
  params: Promise<{ locale: string; product: string }>;
}

export async function generateMetadata({ params }: PrivacyPolicyProps): Promise<Metadata> {
  const { locale, product } = await params;
  const res = await getPrivacyWithFallback(product, locale);
  return setPageMetadata(res.data.privacy.seo, product);
}

export default async function PrivacyPolicy({ params }: PrivacyPolicyProps) {
  const { locale, product } = await params;
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
