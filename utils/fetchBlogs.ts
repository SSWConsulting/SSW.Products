import { cache } from "react";
import client from "../tina/__generated__/client";
import NotFoundError from "../src/errors/not-found";

type GetBlogsForProductProps = {
  startCursor?: string;
  offset?: number;
  limit?: number;
  keyword?: string;
  product: string;
  category?: string;
  filteredBlogs?: string[];
  locale?: string;
  branch?: string;  
  loadAll?: boolean;
};

// Workaround: graphql doesn't allow you to query by file name
const getTitlesInTenant = cache(async (product: string, locale?: string) => {
  const res = await client.queries.blogsConnection();
  const titles =
    res.data.blogsConnection.edges?.reduce<string[]>((acc: string[], curr) => {
      const pathToCheck = locale === 'zh' 
        ? `/blogs/${product}/zh` 
        : `/blogs/${product}`;
      
      const inCurrentTenant = curr?.node?._sys.path.includes(pathToCheck);
      
      const isCorrectLanguage = locale === 'zh' 
        ? curr?.node?._sys.path.includes(`/blogs/${product}/zh`)
        : !curr?.node?._sys.path.includes(`/blogs/${product}/zh`);
      
      const title = curr?.node?.title;
      if (title && !acc.includes(title) && inCurrentTenant && isCorrectLanguage) {
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
  locale,
  branch,
  loadAll,
}: GetBlogsForProductProps) {
  try {

    const fetchOptions = branch? {
      fetchOptions: {
        headers: {
          "x-branch": branch,
        },
      }
    } : {}

    let titles = await getTitlesInTenant(product, locale);
    if (filteredBlogs && filteredBlogs.length > 0) {
      titles = titles.filter((title) => !filteredBlogs.includes(title));
    }

    if (keyword) {
      titles = titles.filter((title) =>
        title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // "Load more" pulls in every remaining article in one go, so the page size
    // becomes the candidate title count - the most documents the filter can match
    const pageSize = loadAll ? Math.max(titles.length, limit) : limit;

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
      last: pageSize * 2,
      before: startCursor,
      sort: "date",
      },{ ...fetchOptions});
    if (
      !res.data ||
      !res.data.blogsConnection ||
      !res.data.blogsConnection.edges ||
      !res.data.blogsConnection.edges.length
    ) {
      throw new NotFoundError("No documents found");
    }

    const remainingPages = Math.max(
      res.data.blogsConnection.edges.length - pageSize,
      0
    );

    const croppedBlogResponse = res.data.blogsConnection.edges?.slice(0, pageSize);

    return {
      blogs: croppedBlogResponse,
      remainingPages,
    };
  }
  catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    throw error;
  }
}

export type BlogsResponse = Awaited<ReturnType<typeof getBlogsForProduct>>;
