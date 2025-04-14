import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { BlogSearchProvider } from "../../../components/providers/BlogSearchProvider";
import QueryProvider from "../../../components/providers/QueryProvider";
import BlogIndexClient from "../../../components/shared/BlogIndexClient";
import FooterServer from "../../../components/shared/FooterServer";
import NavBarServer from "../../../components/shared/NavBarServer";
import client from "../../../tina/__generated__/client";
import { getBlogsForProduct } from "../../../utils/fetchBlogs";
interface BlogIndex {
  params: { product: string };
}

export async function generateMetadata({ params }: BlogIndex) {
  const { product } = params;
  return {
    title: `${product} Blogs`,
    description: `Find out more about ${product}, the latest news and updates posted on our blog.`,
    openGraph: {
      title: `${product} Blogs`,
      description: `Find out more about ${product}, the latest news and updates posted on our blog.`,
      images: `./public/default-images/${product}-default.png`,
    },
  };
}

const getBlogPageData = async (product: string) => {
  try {
    const res = await client.queries.blogsIndex({
      relativePath: `${product}/blog/index.json`,
    });
    return res;
  } catch (error) {
    console.error("Error fetching blog page data:", error);
    return notFound();
  }
};
export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => ({
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

const getCategories = async (product: string) => {
  //get all categories in use from the posts
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
  //only return the categories in usfilteredPosts.reduce<string[]>((acc, curr) => {
};

export default async function BlogIndex({ params }: BlogIndex) {
  const product = params.product;
  const categories = await getCategories(product);
  const tinaData = await getBlogPageData(product);
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [`blogs`], // Ensure queryKey matches BlogIndexClient
    queryFn: () => getBlogsForProduct({ product, limit: 3 }),
    initialPageParam: undefined,
  });

  const dehydratedState = dehydrate(queryClient, {});

  return (
    <div className="text-gray-100 flex flex-col">
      <NavBarServer product={params.product} />

      <QueryProvider>
        {/* Padding accomodates for the navbar */}
        <div className="flex flex-col min-h-screen pt-navBarHeight">
          <HydrationBoundary state={dehydratedState}>
            <BlogSearchProvider categories={categories}>
              <BlogIndexClient {...tinaData} product={product} />
            </BlogSearchProvider>
          </HydrationBoundary>
          <FooterServer product={params.product} />
        </div>
      </QueryProvider>
    </div>
  );
}
