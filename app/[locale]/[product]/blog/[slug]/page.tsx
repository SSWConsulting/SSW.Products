import client from "@tina/__generated__/client";
import { setPageMetadata } from "@utils/setPageMetaData";
import { getBlogWithFallback } from "@utils/i18n";
import getBlogPageData from "@utils/pages/getBlogPageData";
import ClientFallbackPage from "@app/client-fallback-page";
import NotFoundError from "@/errors/not-found";
import { BlogPageShared, BlogPageSharedProps } from "./blog-shared";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

interface BlogPostProps {
  params: Promise<{ locale: string; slug: string; product: string }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { locale, slug, product } = await params;
  try {
    const res = await getBlogWithFallback({ product, slug, locale });
    if (!res?.data?.blogs) return null;
    return setPageMetadata(res?.data?.blogs?.seo, product, "Blog");
  } catch (error) {
    if (error instanceof NotFoundError) return {};
  }
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => {
      const breadcrumbs = post?.node?._sys.breadcrumbs ?? [];
      return {
        locale: localeFromBreadcrumbs(breadcrumbs),
        product: breadcrumbs[0],
        slug: post?.node?._sys.filename,
      };
    }) || []
  );
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { locale, slug, product } = await params;
  try {
    const data = await getBlogPageData(product, slug, locale);
    return <BlogPageShared {...data} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
        <ClientFallbackPage<BlogPageSharedProps>
          product={product}
          relativePath={slug}
          query={"getBlogPageData"}
          Component={BlogPageShared}
        />
      );
    }
    throw error;
  }
}
