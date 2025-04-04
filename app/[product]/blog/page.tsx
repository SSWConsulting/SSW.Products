import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryProvider from "../../../components/providers/QueryProvider";
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
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

export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => ({
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

export default async function BlogIndex({ params }: BlogIndex) {
  const product = params.product;

  const client = new QueryClient();
  await client.prefetchInfiniteQuery({
    queryKey: ["blogs"], // Ensure queryKey matches BlogIndexClient
    queryFn: () => getBlogsForProduct({ product, limit: 3 }),
    initialPageParam: undefined,
  });

  const dehydratedState = dehydrate(client, {});

  console.log("dehydrated state", JSON.stringify(dehydratedState));

  console.log("dehy");
  return (
    <div className="text-gray-100 flex flex-col">
      <NavBarServer product={params.product} />

      <QueryProvider>
        {/* Padding accomodates for the navbar */}
        <div className="flex flex-col min-h-screen pt-[124px]">
          <InteractiveBackground fogColor="red" />
          <HydrationBoundary state={dehydratedState}>
            <BlogIndexClient product={product} />
          </HydrationBoundary>
          <FooterServer product={params.product} />
        </div>
      </QueryProvider>
    </div>
  );
}
