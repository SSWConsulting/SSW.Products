import { notFound } from "next/navigation";
import { cache } from "react";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";
import ConferenceClient from "./ConferenceClient";

interface ConferencePageProps {
  params: Promise<{ product: string }>;
}

// Each product's current conference lives at content/conference/<product>/index.mdx
const fetchConference = cache(async (product: string) => {
  const relativePath = `${product}/index.mdx`;
  const res = await client.queries.conference({ relativePath });
  return {
    data: res.data,
    query: res.query,
    variables: { relativePath },
  };
});

export async function generateMetadata({ params }: ConferencePageProps) {
  const { product } = await params;
  try {
    const { data } = await fetchConference(product);
    return setPageMetadata(data?.conference?.seo, product);
  } catch {
    return {
      title: `${product} Conference`,
      description: `Details about the next ${product} conference are coming soon.`,
    };
  }
}

export default async function ConferencePage({ params }: ConferencePageProps) {
  const { product } = await params;
  try {
    const { data, query, variables } = await fetchConference(product);
    return (
      <ConferenceClient query={query} data={data} variables={variables} />
    );
  } catch {
    notFound();
  }
}

// 1 day ISR; content redeploys on TinaCMS publish anyway.
export const revalidate = 86400;
