import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import QueryProvider from '../../../components/providers/QueryProvider';
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import BlogIndexClient, { getProducts } from "../../../components/shared/BlogIndexClient";
import FooterServer from "../../../components/shared/FooterServer";
import NavBarServer from "../../../components/shared/NavBarServer";
import client from "../../../tina/__generated__/client";
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
  }
}
// ...WHY?!

export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return sitePosts.data.blogsConnection?.edges?.map((post) => ({
    product: post?.node?._sys.breadcrumbs[0]
  })) || []
}



export default async function BlogIndex({ params }: BlogIndex) {

  //const blogs = await getBlogsForProduct(params.product);
  console.log("params", params)
  const product = params.product

  console.log("product", product)
  // const featuredBlog = blogs.data[0];



  // const blogPosts = blogs.data.filter((post)=> { 
  //   return post?.title != featuredBlog?.title 
  // }).slice(0, 3) 

  // const categories = [
  //   "All Posts",
  //   "Productivity",
  //   "AI",
  //   "Templates",
  //   "Best Practices",
  //   "Case Studies",
  //   "Research",
  //   "Product Updates",
  // ]

  const client = new QueryClient()


  
  client.prefetchInfiniteQuery({
    queryKey: ["test", product], // Ensure queryKey matches usage in BlogIndexClient
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam, product),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => allPages.length + 1, // Define next page logic
  })


  const dehydratedState = dehydrate(client)


  return <div className="min-h-screen text-gray-100 lg:pt-32 mt-20 ">
  
  {/* Header */}
  {/* <header className="container mx-auto py-4 px-4 flex justify-between items-center relative z-50">
    <div className="flex items-center gap-2">
      <Link href="/" className="font-bold text-xl">
        YakShaver.ai
      </Link>
    </div>
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/pricing" className="text-sm hover:text-[#c41414] transition-colors">
        Pricing
      </Link>
      <Link href="/blog" className="text-sm text-[#c41414] transition-colors">
        Blog
      </Link>
      <Link href="/about" className="text-sm hover:text-[#c41414] transition-colors">
        About
      </Link>
    </nav>
    <div className="flex items-center gap-4">
      <Button variant="ghost" className="text-gray-300 hover:text-white">
        Log in
      </Button>
      <Button className="bg-[#c41414] hover:bg-[#a51212] text-white">Sign up</Button>
    </div>
  </header> */}

  {/* Blog Hero */}
  <QueryProvider>
  <NavBarServer product={params.product} />
  <InteractiveBackground fogColor="red" />
  <HydrationBoundary state={dehydratedState}>
    <BlogIndexClient product={product} />
  </HydrationBoundary>
  </QueryProvider>
  <FooterServer product={params.product} />
</div>
}
