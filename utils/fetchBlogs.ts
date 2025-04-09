import { cache } from "react";
import client from "../tina/__generated__/client";

type GetBlogsForProductProps = {
  endCursor?: string;
  offset?: number;
  limit?: number;
  keyword?: string;
  product: string;
  category?: string;
};

// Workaround: graphql doesn't allow you to query by file name
const getTitlesInTenant = cache(async (product: string) => {
  const res = await client.queries.blogsConnection();
  const titles =
    res.data.blogsConnection.edges?.reduce<string[]>((acc: string[], curr) => {
      const inCurrentTenant = curr?.node?._sys.path.includes(
        `/blogs/${product}`
      );
      const title = curr?.node?.title;
      if (title && !acc.includes(title) && inCurrentTenant) {
        return [...acc, title];
      }
      return acc;
    }, []) || [];
  return titles;
});

export async function getBlogsForProduct({
  category,
  endCursor,
  limit,
  product,
  keyword,
}: GetBlogsForProductProps) {
  try {
    let titles = await getTitlesInTenant(product);
    if (keyword) {
      titles = titles.filter((title) =>
        title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    const categoryFilter = category
      ? {
          category: {
            eq: category,
          },
        }
      : {};
    const res = await client.queries.blogsConnection({
      filter: {
        title: { in: titles },
        ...categoryFilter,
      },
      after: endCursor,
      first: limit,
      sort: "date",
    });

    if (
      !res.data ||
      !res.data.blogsConnection ||
      !res.data.blogsConnection.edges ||
      !res.data.blogsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }

    res.data.blogsConnection.edges = res.data.blogsConnection.edges?.filter(
      (edge) => {
        return edge?.node?._sys?.path?.includes(`/blogs/${product}/`);
      }
    );

    return res.data.blogsConnection;
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    throw error;
  }
}
