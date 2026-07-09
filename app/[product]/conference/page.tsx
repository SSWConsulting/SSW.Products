import { notFound } from "next/navigation";
import client from "../../../tina/__generated__/client";
import { setPageMetadata } from "../../../utils/setPageMetaData";
import ConferenceClient from "./ConferenceClient";

interface ConferencePageProps {
  params: Promise<{ product: string }>;
}

const CONFERENCE_FILE = "YakCon2026.mdx";

const fetchConference = async (product: string) => {
  const relativePath = `${product}/${CONFERENCE_FILE}`;
  const res = await client.queries.conference({ relativePath });
  return {
    data: res.data,
    query: res.query,
    variables: { relativePath },
  };
};

export async function generateMetadata({ params }: ConferencePageProps) {
  const { product } = await params;
  try {
    const { data } = await fetchConference(product);
    return setPageMetadata(data?.conference?.seo, product);
  } catch {
    return {};
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

// 1h ISR; content redeploys on TinaCMS publish anyway.
export const revalidate = 3600;
