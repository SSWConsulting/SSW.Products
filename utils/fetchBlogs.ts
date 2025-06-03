import { cache } from "react";
import client from "../tina/__generated__/client";

type GetBlogsForProductProps = {
  startCursor?: string;
  offset?: number;
  limit?: number;
  keyword?: string;
  product: string;
  category?: string;
  filteredBlogs?: string[];
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

// Get blogs using reverse pagination https://tina.io/docs/graphql/queries/advanced/pagination#reverse-pagination
export async function getBlogsForProduct({
  category,
  startCursor,
  limit = 3,
  product,
  keyword,
  filteredBlogs,
}: GetBlogsForProductProps) {
  try {
    let titles = await getTitlesInTenant(product);
    if (filteredBlogs && filteredBlogs.length > 0) {
      titles = titles.filter((title) => !filteredBlogs.includes(title));
    }

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

    const beforeFilter = startCursor ? { before: startCursor } : {};
    const res = await client.queries.blogsConnection({
      filter: {
        title: { in: titles },
        ...categoryFilter,
      },
      ...beforeFilter,
      last: limit * 2,
      before: startCursor,
      sort: "date",
    });
    await new Promise((resolve) => setTimeout(resolve, 10 * 1000)); // 10 seconds
    if (
      !res.data ||
      !res.data.blogsConnection ||
      !res.data.blogsConnection.edges ||
      !res.data.blogsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }

    const remainingPages = Math.max(
      res.data.blogsConnection.edges.length - limit,
      0
    );

    const croppedBlogResponse = res.data.blogsConnection.edges?.slice(0, limit);

    return {
      blogs: croppedBlogResponse,
      remainingPages,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    throw error;
  }
}
