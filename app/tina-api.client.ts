import getBlogPageData from "@utils/pages/getBlogPageData";
import axios, { AxiosError, AxiosResponse } from "axios";
import NotFoundError from "../src/errors/not-found";
import getDocPageData from "@utils/pages/getDocPageData";
import getPageData from "@utils/pages/getPageData";

type QueryFunction = (product: string, relativePath: string) => Promise<unknown>;

class ApiClient {
  private static handle(response: AxiosResponse) {
  }
  static queries: Record<string, QueryFunction> = {
      getBlogPageData: async (product: string, relativePath: string)=> {
      try{
        const response = await axios.post<Awaited<ReturnType<typeof getBlogPageData>>>("/api/page-data/blogs", {
          product,
          relativePath,
        });
        return response.data;
      }
      catch(error){
        if(error instanceof AxiosError){
          if(error.response?.status === 404){
            throw new NotFoundError("Blog page not found");
          }
        }
        throw error;
      }
    },
    getDocPageData: async (product: string, relativePath: string)=> {
      try{
        const response = await axios.post<Awaited<ReturnType<typeof getDocPageData>>>("/api/page-data/docs", {
          product,
          relativePath,
        });
        return response.data;
      }
      catch(error){
        if(error instanceof AxiosError){
          if(error.response?.status === 404){
            throw new NotFoundError("Doc page not found");
          }
        }
        throw error;
      }
    },

    getPageData: async (product: string, relativePath: string)=> {

      try {
        const response = await axios.post<Awaited<ReturnType<typeof getPageData>>>("/api/page-data", {
          product,
          relativePath,
        });
        return response.data;
      }
      catch(error){
        if(error instanceof AxiosError)
        {
          if(error.response?.status === 404){
            throw new NotFoundError("Page not found");
        }
        throw error;   
      }
    }
  }
}
}

export default ApiClient;
