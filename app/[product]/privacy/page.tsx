import { Metadata } from "next";
import { notFound } from "next/navigation";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import FooterServer from "../../../components/shared/FooterServer";
import NavBarServer from "../../../components/shared/NavBarServer";
import PrivacyPolicyClient from "../../../components/shared/PrivacyPolicyClient";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";

interface PrivacyPolicyProps {
  params: {
    product: string;
  };
}

export async function generateMetadata({
  params: { product },
}: PrivacyPolicyProps): Promise<Metadata> {
  const res = await getPrivacyPolicy(product);

  const privacy = res.data.privacy;
  const metadata = setPageMetadata(privacy.seo, product);

  return metadata;
}

async function getPrivacyPolicy(product: string) {
  try {
    const res = await client.queries.privacy({
      relativePath: `${product}/index.mdx`,
    });

    return res;
  } catch {
    return notFound();
  }
}

export default async function PrivacyPolicy({ params }: PrivacyPolicyProps) {
  const { product } = params;
  const res = await getPrivacyPolicy(product);

  return (
    <div className="flex flex-col min-h-screen">
      <InteractiveBackground />
      <NavBarServer product={product} />
      <div className="flex-grow">
        <PrivacyPolicyClient {...res} />
      </div>
      <FooterServer product={product} />
    </div>
  );
}
