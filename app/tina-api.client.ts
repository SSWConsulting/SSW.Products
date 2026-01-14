import getBlogPageData from "@utils/pages/getBlogPageData";
import axios, { AxiosResponse } from "axios";
import NotFoundError from "../src/errors/not-found";
import getDocPageData from "@utils/pages/getDocPageData";

type QueryFunction = (product: string, relativePath: string) => Promise<unknown>;

class ApiClient {
  private static handle(response: AxiosResponse) {
    if (response.status === 404) {
      throw new NotFoundError("Resource not found");
    }
    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.data
  }
  static queries: Record<string, QueryFunction> = {
      getBlogPageData: async (product: string, relativePath: string)=> {
          const response = await axios.post<Awaited<ReturnType<typeof getBlogPageData>>>("/api/page-data/blogs", {
        product,
        relativePath,
      });
      return this.handle(response);
    },
    getDocPageData: async (product: string, relativePath: string)=> {
      const response = await axios.post<Awaited<ReturnType<typeof getDocPageData>>>("/api/page-data/docs", {
        product,
        relativePath,
      });
      return this.handle(response);
    },
  };
}

export default ApiClient;
