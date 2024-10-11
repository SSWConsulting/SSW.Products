import client from '../tina/__generated__/client';

export async function getBlogsForProduct(product: string, offset = 0, limit = 5) {
  try {
    const res = await client.queries.getAllBlogs();

    if (
      !res.data ||
      !res.data.blogsConnection ||
      !res.data.blogsConnection.edges ||
      !res.data.blogsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }

    const filteredBlogs = res.data.blogsConnection.edges?.filter((edge: any) =>
      edge.node?._sys?.path?.includes(`/blogs/${product}/`)
    );

    if (!filteredBlogs || !filteredBlogs.length) {
      throw new Error("No documents found");
    }

    const sortedBlogs = filteredBlogs.sort((a: any, b: any) => {
      const dateA = new Date(a.node.date);
      const dateB = new Date(b.node.date);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedBlogs = sortedBlogs.slice(offset, offset + limit);

    return {
      query: res.query,
      data: paginatedBlogs.map((edge: any) => edge.node),
      hasMore: sortedBlogs.length > offset + limit,
    };
  } catch (error) {
    console.error('Error fetching TinaCMS blog data:', error);
    throw error;
  }
}
