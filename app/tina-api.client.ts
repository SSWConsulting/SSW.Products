import getBlogPageData from "@utils/pages/getBlogPageData";
import axios from "axios";
import NotFoundError from "../errors/not-found";

type QueryFunction = (product: string, relativePath: string) => Promise<unknown>;

class ApiClient {
  static queries: Record<string, QueryFunction> = {
    getBlogPageData: async (product: string, relativePath: string)=> {
        const response = await axios.post<Awaited<ReturnType<typeof getBlogPageData>>>("/api/page-data/blogs", {
      product,
      relativePath,
    });
    if(response.status === 404)
    {
        throw new NotFoundError("Blog post not found");
    }
    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
      return response.data;
    },
    // Add more queries here as needed
  };
}

export default ApiClient;
