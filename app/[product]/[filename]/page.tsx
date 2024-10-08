import { notFound } from "next/navigation";
import client from "../../../tina/__generated__/client";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../components/shared/NavBarServer";
import FooterServer from "../../../components/shared/FooterServer";
import HomePageClient from "../../../components/shared/HomePageClient";

interface FilePageProps {
  params: { product: string; filename: string };
}

export default async function FilePage({ params }: FilePageProps) {
  const { product, filename } = params;

  

  const fileData = await getPage(product, filename);



  return (
    <div>
      <InteractiveBackground />
      <NavBarServer product={product} />
      <HomePageClient
        query={fileData.query}
        data={fileData.data}
        variables={{ relativePath: `${product}/${filename}.json` }}
      />
      <FooterServer product={product} />
    </div>
  );
}

async function getPage(product: string, filename: string) {
  try {
    const res = await client.queries.pages({
      relativePath: `${product}/${filename}.json`,
    });
    return {
      query: res.query,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS data:", error);
    notFound();
  }
}
