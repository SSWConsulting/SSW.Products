import { notFound } from "next/navigation";

import BlogPostClient from "@comps/shared/BlogPostClient";
import client from "@tina/__generated__/client";
import { setPageMetadata } from "@utils/setPageMetaData";
import { getLocale, getBlogWithFallback } from "@utils/i18n";
import getBlogPageData from "@utils/pages/getBlogPageData";
import ClientFallbackPage, { QueryKey } from "../../../client-fallback-page";
import NotFoundError from "../../../../errors/not-found";
import { BlogPageShared, BlogPageSharedProps } from "./blog-shared";


export const dynamic = 'force-dynamic';
interface BlogPostProps {
  params: Promise<{
    slug: string;
    product: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug, product } = await params;
  const locale = await getLocale();

  try {
    const res = await getBlogWithFallback({product, slug, locale});

    if (!res?.data?.blogs) {
      return null;
    }

    const metadata = setPageMetadata(res?.data?.blogs?.seo, product, 'Blog');
    return metadata;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => ({
      slug: post?.node?._sys.filename,
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}


// Consolidated data fetching for blog post



export default async function BlogPost({ params }: BlogPostProps) {
  const { slug, product } = await params;
  try{
    const data = await getBlogPageData(product, slug);    

    return (
      <BlogPageShared {...data} />
    );
  }
  catch (error){
    if(error instanceof NotFoundError){
          return <ClientFallbackPage<BlogPageSharedProps> 
        product={product} 
        relativePath={slug} 
        query={"getBlogPageData"}
        Component={BlogPageShared}
        />; 
    }
    throw error;
  }
}




