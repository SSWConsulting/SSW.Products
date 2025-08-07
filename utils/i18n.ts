import { headers } from 'next/headers';
import { notFound } from "next/navigation";
import client from "../tina/__generated__/client";

export function getLocale(): string {
  const headersList = headers();
  return headersList.get('x-language') || 'en';
}

export function getRelativePath(product: string, filename: string, locale: string): string {
  return locale === 'zh' ? `${product}/zh/${filename}.json` : `${product}/${filename}.json`;
}

export async function getPageWithFallback(
  product: string, 
  filename: string, 
  locale: string = 'en',
  options?: {
    fetchOptions?: {
      next?: {
        revalidate?: number;
      };
    };
  }
) {
  try {
    let relativePath: string;
    
    if (locale === 'zh') {
      relativePath = `${product}/zh/${filename}.json`;
      
      try {
        const res = await client.queries.pages(
          { relativePath },
          options
        );
        return {
          query: res.query,
          data: res.data,
          variables: res.variables,
        };
      } catch (error) {
        console.log(`Chinese version not found, falling back to English for ${product}/${filename}`);
      }
    }
    
    relativePath = `${product}/${filename}.json`;
    const res = await client.queries.pages(
      { relativePath },
      options
    );
    return {
      query: res.query,
      data: res.data,
      variables: res.variables,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS data:", error);
    notFound();
  }
}

export async function getBlogIndexWithFallback(
  product: string,
  locale: string = 'en',
  options?: {
    fetchOptions?: {
      next?: {
        revalidate?: number;
      };
    };
  }
) {
  try {
    let relativePath: string;
    
    if (locale === 'zh') {
      relativePath = `${product}/zh/blog/index.json`;
      
      try {
        const res = await client.queries.blogsIndex(
          { relativePath },
          options
        );
        return res;
      } catch (error) {
        console.log(`Chinese blog index not found, falling back to English for ${product}`);
      }
    }
    
    relativePath = `${product}/blog/index.json`;
    const res = await client.queries.blogsIndex(
      { relativePath },
      options
    );
    return res;
  } catch (error) {
    console.error("Error fetching blog index data:", error);
    notFound();
  }
}

export async function getBlogWithFallback(
  product: string,
  slug: string,
  locale: string = 'en',
  options?: {
    fetchOptions?: {
      next?: {
        revalidate?: number;
      };
    };
  }
) {
  try {
    let relativePath: string;
    
    if (locale === 'zh') {
      relativePath = `${product}/zh/${slug}.mdx`;
      
      try {
        const res = await client.queries.blogs(
          { relativePath },
          options
        );
        
        if (res?.data?.blogs) {
          return res;
        }
      } catch (error) {
        console.log(`Chinese blog post not found, falling back to English for ${product}/${slug}`);
      }
    }
    
    relativePath = `${product}/${slug}.mdx`;
    const res = await client.queries.blogs(
      { relativePath },
      options
    );
    
    if (!res?.data?.blogs) {
      return null;
    }
    
    return res;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
