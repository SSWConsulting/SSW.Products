import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { BlogSearchProvider } from "../../../components/providers/BlogSearchProvider";
import BlogIndexClient from "../../../components/shared/BlogIndexClient";
import client from "../../../tina/__generated__/client";
import { getBlogsForProduct } from "../../../utils/fetchBlogs";
import { getLocale, getBlogIndexWithFallback } from "../../../utils/i18n";
interface BlogIndex {
  params: Promise<{ product: string }>;
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
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => ({
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

const getCategories = async (product: string) => {
  const posts = await client.queries.blogsConnection();
  const filteredPosts = posts.data.blogsConnection.edges?.filter((blog) => {
    return blog?.node?._sys?.path.includes(product);
  });
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
  const {product} = await params;
  const locale = await getLocale();
  
  const categories = await getCategories(product);
  const tinaData = await getBlogIndexWithFallback(product, locale);
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [`blogs${locale || 'en'}`],
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
