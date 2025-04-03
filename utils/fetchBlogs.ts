import client from '../tina/__generated__/client';


type GetBlogsForProductProps = {
  endCursor?: string,
  offset?: number,
  limit?: number

  product: string
}


export async function getBlogsForProduct({endCursor, limit, product}: GetBlogsForProductProps){

  try {

    const res = await client.queries.blogsConnection({after: endCursor, first: limit, sort: "date"})

    if (
      !res.data ||
      !res.data.blogsConnection ||
      !res.data.blogsConnection.edges ||
      !res.data.blogsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }


    res.data.blogsConnection.edges = res.data.blogsConnection.edges?.filter((
      edge: any) =>
      edge.node?._sys?.path?.includes(`/blogs/${product}/`)
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
    console.error('Error fetching TinaCMS blog data:', error);
    throw error;
  }
}
