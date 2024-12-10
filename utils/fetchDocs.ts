import client from '../tina/__generated__/client';

export async function getDocsForProduct(product: string, offset = 0, limit = 5) {
  try {
    const res = await client.queries.getAllDocs();

    if (
      !res.data ||
      !res.data.docsConnection ||
      !res.data.docsConnection.edges ||
      !res.data.docsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }

    const filteredDocs = res.data.docsConnection.edges?.filter((edge: any) =>
      edge.node?._sys?.path?.includes(`/docs/${product}/`)
    );

    if (!filteredDocs || !filteredDocs.length) {
      throw new Error("No documents found");
    }

    const sortedBlogs = filteredDocs.sort((a: any, b: any) => {
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
