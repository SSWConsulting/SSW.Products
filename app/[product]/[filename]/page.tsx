import { notFound } from "next/navigation";

import CustomizeableBackground from "../../../components/shared/Background/CustomizeableBackground";
import FooterServer from "../../../components/shared/FooterServer";
import HomePageClient from "../../../components/shared/HomePageClient";
import NavBarServer from "../../../components/shared/NavBarServer";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";

interface FilePageProps {
  params: { product: string; filename: string };
}

export async function generateMetadata({ params }: FilePageProps) {
  const { product, filename } = params;
  const fileData = await getPage(product, filename);
  const metadata = setPageMetadata(fileData.data?.pages?.seo, product);
  return metadata;
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.pagesConnection({});
  return (
    sitePosts.data.pagesConnection?.edges?.map((post) => ({
      filename: post?.node?._sys.filename,
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

export default async function FilePage({ params }: FilePageProps) {
  const { product, filename } = params;

  const fileData = await getPage(product, filename);

  return (
    <CustomizeableBackground tinaData={fileData}>
      <NavBarServer product={product} />
      <HomePageClient
        query={fileData.query}
        data={fileData.data}
        variables={{ relativePath: `${product}/${filename}.json` }}
      />
      <FooterServer product={product} />
      {fileData.data?.pages?.seo?.googleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              fileData.data?.pages?.seo?.googleStructuredData ?? {}
            ),
          }}
        />
      )}
    </CustomizeableBackground>
  );
}

async function getPage(product: string, filename: string) {
  try {
    const res = await client.queries.pages(
      {
        relativePath: `${product}/${filename}.json`,
      },
      {
        fetchOptions: {
          next: {
            revalidate: 10,
          },
        },
      }
    );
    return {
      query: res.query,
      data: res.data,
      variables: res.variables,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS data:", error);
    notFound();
  }
}

export const revalidate = 60;
