import { Metadata } from "next";
import { notFound } from "next/navigation";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import PrivacyPolicyClient from "../../../components/shared/PrivacyPolicyClient";
import { getLocale, getPrivacyWithFallback } from "../../../utils/i18n";
import { setPageMetadata } from "../../../utils/setPageMetaData";

interface PrivacyPolicyProps {
  params: {
    product: string;
  };
}

export async function generateMetadata({
  params: { product },
}: PrivacyPolicyProps): Promise<Metadata> {
  const locale = getLocale();
  const res = await getPrivacyWithFallback(product, locale);

  const privacy = res.data.privacy;
  const metadata = setPageMetadata(privacy.seo, product);

  return metadata;
}

export default async function PrivacyPolicy({ params }: PrivacyPolicyProps) {
  const { product } = params;
  const locale = getLocale();
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
