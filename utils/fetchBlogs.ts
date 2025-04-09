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

const getArticleTitles = cache(async () => {
  const res = await client.queries.blogsConnection();
  const titles =
    res.data.blogsConnection.edges?.reduce<string[]>((acc: string[], curr) => {
      const title = curr?.node?.title;
      if (title && !acc.includes(title)) {
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
    const titles = await getArticleTitles();

    const titleFilter = keyword
      ? {
          title: { in: titles.filter((title) => title.includes(keyword)) },
        }
      : {};

    const categoryFilter = category
      ? {
          category: {
            eq: category,
          },
        }
      : {};
    const res = await client.queries.blogsConnection({
      filter: {
        ...titleFilter,
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

    // if (!filteredBlogs || !filteredBlogs.length) {
    //   throw new Error("No documents found");
    // }

    // const sortedBlogs = filteredBlogs.sort((a ,b) => {
    //   if(!a?.node?.date || !b?.node?.date) return 0;
    //   const dateA = new Date(a.node.date);
    //   const dateB = new Date(b.node.date);
    //   return dateB.getTime() - dateA.getTime();
    // });

    // const paginatedBlogs = sortedBlogs.slice(offset, offset + limit);

    // {
    //   // query: res.query,
    //   return
    //   data: filteredBlogs.map((edge) => {
    //     if(!edge?.node) return null;
    //       return edge.node
    //   }),
    //   // hasMore: filteredBlogs.length > offset + limit,
    // };
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    throw error;
  }
}
