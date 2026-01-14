import { headers } from 'next/headers';
import { notFound } from "next/navigation";
import client from "../tina/__generated__/client";

export async function getLocale(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-language') || 'en';
}


// TODO: check if internationalized pages still load after adding page previews

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

export async function getBlogWithFallback({product, slug, locale = 'en', revalidate, branch = "main"}:
  {product: string,
  slug: string,
  locale?: string,
  revalidate?: number,
  branch?: string

  }
) {
  try {
    let relativePath: string;


    const revalidateOptions = revalidate? {next: { revalidate }} : {}

    const options = {
      fetchOptions: {
        headers: {
          "x-branch": branch,
        },
        ...revalidateOptions
      }
    }

    // if(revalidate)
    if (locale === 'zh') {
      relativePath = `${product}/zh/${slug}.mdx`;
      
      try {
        const res = await client.queries.blogs({ relativePath, },options);
        console.log("res", res);
        if (res?.data?.blogs) {
          return res;
        }
      } catch (error) {
        console.log(`Chinese blog post not found, falling back to English for ${product}/${slug}`);
      }
    }
    
    relativePath = `${product}/${slug}.mdx`;
    console.log("options", options);  

    console.log("relativePath", relativePath);
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

export async function getNavigationBarWithFallback(
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
      relativePath = `${product}/zh/${product}-NavigationBar.json`;
      
      try {
        const res = await client.queries.navigationBar(
          { relativePath },
          options
        );
        return res;
      } catch (error) {
        console.log(`Chinese navigation bar not found, falling back to English for ${product}`);
      }
    }
    
    relativePath = `${product}/${product}-NavigationBar.json`;
    const res = await client.queries.navigationBar(
      { relativePath },
      options
    );
    return res;
  } catch (error) {
    console.error("Error fetching navigation bar:", error);
    return null;
  }
}

export async function getFooterWithFallback(
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
      relativePath = `${product}/zh/${product}-Footer.json`;
      
      try {
        const res = await client.queries.footer(
          { relativePath },
          options
        );
        return res;
      } catch (error) {
        console.log(`Chinese footer not found, falling back to English for ${product}`);
      }
    }
    
    relativePath = `${product}/${product}-Footer.json`;
    const res = await client.queries.footer(
      { relativePath },
      options
    );
    return res;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}

export async function getPrivacyWithFallback(
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
      relativePath = `${product}/zh/index.mdx`;
      
      try {
        const res = await client.queries.privacy(
          { relativePath },
          options
        );
        return res;
      } catch (error) {
        console.log(`Chinese privacy policy not found, falling back to English for ${product}`);
      }
    }
    
    relativePath = `${product}/index.mdx`;
    const res = await client.queries.privacy(
      { relativePath },
      options
    );
    return res;
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    notFound();
  }
}
