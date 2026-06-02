import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { BlogSearchProvider } from "@comps/providers/BlogSearchProvider";
import BlogIndexClient from "@comps/shared/BlogIndexClient";
import client from "@tina/__generated__/client";
import { getBlogsForProduct } from "@utils/fetchBlogs";
import { getBlogIndexWithFallback } from "@utils/i18n";
import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

interface BlogIndex {
  params: Promise<{ locale: string; product: string }>;
}

export async function generateMetadata({ params }: BlogIndex) {
  const { product } = await params;
  return {
    title: `${product} - Blog - Product News, Updates & Announcements`,
    description: `Explore the latest news, updates, and insights from the ${product} team, including product releases and announcements.`,
    openGraph: {
      title: `${product} - Blog - Product News, Updates & Announcements`,
      description: `Explore the latest news, updates, and insights from the ${product} team, including product releases and announcements.`,
      images: `./public/default-images/${product}-default.png`,
    },
  };
}

export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  const seen = new Set<string>();
  const params: { locale: string; product: string }[] = [];
  for (const edge of sitePosts.data.blogsConnection?.edges ?? []) {
    const breadcrumbs = edge?.node?._sys.breadcrumbs ?? [];
    const product = breadcrumbs[0];
    if (!product) continue;
    const locale = localeFromBreadcrumbs(breadcrumbs);
    const key = `${locale}/${product}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ locale, product });
  }
  return params;
}

const getCategories = async (product: string) => {
  const posts = await client.queries.blogsConnection();
  const filteredPosts = posts.data.blogsConnection.edges?.filter((blog) =>
    blog?.node?._sys?.path.includes(product),
  );
  let categories: string[] = [];
  if (filteredPosts) {
    categories = filteredPosts.reduce<string[]>((acc, curr) => {
      const category = curr?.node?.category;
      if (category && !acc.includes(category)) return [...acc, category];
      return acc;
    }, []);
  }
  return categories;
};

export default async function BlogIndex({ params }: BlogIndex) {
  const { locale, product } = await params;
  const categories = await getCategories(product);
  const tinaData = await getBlogIndexWithFallback(product, locale);
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [`blogs${locale || "en"}`],
    queryFn: () => getBlogsForProduct({ product, locale }),
    initialPageParam: undefined,
  });
  const dehydratedState = dehydrate(queryClient, {});
  return (
    <div className="text-gray-100 flex flex-col">
      <div className="flex flex-col min-h-screen">
        <HydrationBoundary state={dehydratedState}>
          <BlogSearchProvider categories={categories}>
            <BlogIndexClient {...tinaData} product={product} locale={locale} />
          </BlogSearchProvider>
        </HydrationBoundary>
      </div>
    </div>
  );
}
