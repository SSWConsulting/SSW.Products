"use client";


import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";
import { getBlogsForProduct } from "../../utils/fetchBlogs";
import { Button } from "../ui/button";

export const getProducts = async (pageParam = 1 ,product: string) => {
  console.log("product", product)
  const products = await getBlogsForProduct(product, pageParam * 3, 3)
  return products

}
// type Blogs = Awaited<ReturnType<typeof getBlogsForProduct>>["data"]


const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
}

// const BlogCard = ({
//   title,
//   author,
//   date,
//   body,
//   readLength,
//   blogPostLink,
// }: {
//   title: string;
//   author: string;
//   date: string;
//   body: TinaMarkdownContent;
//   readLength: string;
//   blogPostLink: string;
// }) => {
//   const blurb = extractBlurbAsTinaMarkdownContent(body, 3); // extract 3 sentences in blurb.

//   return (
//     <Link href={`/blog/${blogPostLink}`}>
//       <div className="p-6 rounded-2xl shadow-2xl bg-stone-700/30 mb-6 text-white border-opacity-15 border-2 hover:border-opacity-85 border-slate-300">
//         <h2 className="text-2xl mb-2">{title}</h2>
//         <div className="font-light text-base">
//           <span>by {author} </span>
//           <div>
//             <span className="text-sm text-gray-300 uppercase">{`${new Date(date).getDate()} ${new Date(date).toLocaleString(
//               "default",
//               { month: "long" }
//             )} ${new Date(date).getFullYear()}`}</span>
//             <span>{` | ${readLength}`}</span>
//           </div>
//           <div className="mt-4">
//             <TinaMarkdown content={blurb} />
//           </div>
//           <div className="mt-4 flex items-center font-light">
//             <span>READ MORE</span>
//             <HiOutlineArrowNarrowRight className="ml-2 transform scale-x-150 scale-y-125" />
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

interface BlogIndexClientProps {
  product: string;
}

export default function BlogIndexClient({
  // data,
  product,
}: BlogIndexClientProps) {
  // const featuredBlog = data[0];
  
  
  const {data} = useInfiniteQuery({
    queryKey: ["test"],
    queryFn:({pageParam})=> getProducts(pageParam,product ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages)=> {
      return allPages.length ++ 
    }
  })
  const featuredBlog = data?.pages[0]?.data[0]
  const categories = [
    "All Posts",
    "Productivity",
    "AI",
    "Templates",
    "Best Practices",
    "Case Studies",
    "Research",
    "Product Updates",
  ]
  return <>
  <section className="relative py-16 bg-gradient-to-b bg-[#131313]">
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-4xl font-bold  mb-4">YakShaver.ai Blog</h1>
      <p className="text-xl text-gray-300">
        Insights, tips, and stories about issue reporting and AI-powered productivity
      </p>
    </div>

    <div className="relative max-w-xl mx-auto mb-16">
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-3 px-4 pl-12 placeholder:text-gray-300 focus:outline-none"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
      </div>
    </div>

    <div className="flex flex-wrap gap-3 justify-center mb-16">
      {categories.map((category, index) => {


      return <Button variant={index === 0 ?  "default" : "ghost" } key={`button ${index}`}>
        {category}
        
        </Button>
        //   key={index}
        //   variant={"primary"}
        //   className={
        //     index === 0
        //       ? "bg-[#c41414] hover:bg-[#a51212] text-white"
        //       : "border-gray-700 text-gray-300 hover:border-[#c41414]/50 hover:text-[#c41414]"
        //   }
        // >
          
        // </Button>
      })}
    </div>
  </div>
</section>

{/* Featured Post */}


{featuredBlog && <>
<section className="py-12">
  <section className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4">Featured Article</h2>
    <div className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border border-white/20 rounded-xl overflow-hidden shadow-xl">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative h-64 md:h-auto">

          {/* TODO: Add Image field to blog post
          <Image
            src={featuredPost.image || "/placeholder.svg"}
            alt={featuredPost.title}
            fill
            className="object-cover"
          /> */}



            
          {/* Todo: 
          <div className="absolute top-4 left-4 bg-[#c41414] text-white text-xs px-3 py-1 rounded-full">
            {featuredPost.category || "Uncategorized"} 
          </div> */}
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{featuredBlog.date && formatDate(featuredBlog.date)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{featuredBlog?.readLength}</span>
            </div>
            <div className="bg-ssw-charcoal  text-white text-xs px-3 py-1 rounded-full">
            {"Uncategorized"}
          </div>
          </div>
          <Link href="/blog/ai-transforming-issue-reporting">
            <h3 className="text-2xl font-bold mb-4 hover:text-ssw-red transition-colors">
              {featuredBlog.title}
            </h3>
          </Link>
          {/* TODO: add excerpt */}
          <section className="text-gray-300 mb-6">
            <TinaMarkdown content={extractBlurbAsTinaMarkdownContent(featuredBlog.body, 2)}  />
          </section>
          <div className="flex justify-between items-center">
            <div className="flex  items-center gap-3">
              
            <div className="size-8 relative rounded-full overflow-hidden">
              <Image src={"/default-images/Placeholder-profile.png"} alt="placeholder blog author" fill className="object-cover" />
            </div>
              <div>
                <p className="font-medium text-sm">{featuredBlog.author}</p>

                {/*
                TODO: Add author roles? (Could use cronjob from SSW People)
                
                <p className="text-gray-500 text-xs">{featuredPost.author.role}</p> */}
              </div>
            </div>
            <Link href="/blog/ai-transforming-issue-reporting">
              <Button className="bg-[#c41414] hover:bg-[#a51212] text-white">Read Article</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
</section>
</>}

{/* Recent Posts */}
<section className="container mx-auto px-4 py-12">
  <h2 className="text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4">Recent Articles</h2>
  
  <div className="grid md:grid-cols-3 gap-8">

{data?.pages.map((page) => 
    page.data.map((post, index) => (
      <div
        key={index}
        className="border bg-gradient-to-r shadow-lg to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="p-6 h-full flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
            {post?.date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post?.date)}</span>
              </div>
            )}
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post?.readLength}</span>
            </div>
            <div className="text-white text-xs px-3 py-1 bg-ssw-charcoal rounded-full">
              {"Uncategorized"}
            </div>
          </div>
          <Link
            className="w-fit"
            href={`/blog/${post?._sys.filename}`}
          >
            <h3 className="text-xl font-bold mb-3 hover:text-ssw-red transition-colors">{post?.title}</h3>
          </Link>
          <section className="text-gray-300 text-sm mb-4">
            <TinaMarkdown content={extractBlurbAsTinaMarkdownContent(post?.body, 3)} />
          </section>
          <Link
            href={`/blog/${post?._sys.filename}`}
            className="text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1"
          >
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    ))
)}
  </div>

  <div className="text-center mt-12">
    
    <Button variant={"secondary"}>Load More Articles</Button>
  </div>
</section>

{/* Newsletter */}
<section className="container mx-auto px-4 py-16">
  <div className="rounded-2xl p-8 md:p-12 bg-[#131313]">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
      <p className="text-gray-300 mb-8">
        Get the latest articles, product updates, and productivity tips delivered straight to your inbox.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-3 px-4 placeholder:text-gray-300 focus:outline-none"
        />
      </div>
    </div>
  </div>
</section>
</>

  //old code, might not be necessary anymore

  // const [blogs, setBlogs] = useState(data);
  // const [loading, setLoading] = useState(false);
  // const [offset, setOffset] = useState(5);
  // const [hasMore, setHasMore] = useState(true);

  // const loadMoreBlogs = useCallback(async () => {
  //   if (loading || !hasMore) return;

  //   setLoading(true);

  //   const moreBlogs = await getBlogsForProduct(product, offset, 5);

  //   if (moreBlogs) {
  //     setBlogs((prevBlogs: any) => {
  //       const updatedBlogs = [...prevBlogs, ...moreBlogs.data];
  //       return updatedBlogs;
  //     });
  //     setOffset(offset + 5);
  //     setHasMore(moreBlogs.hasMore);
  //   }

  //   setLoading(false);
  // }, [offset, hasMore, loading, product]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         loadMoreBlogs();
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   const target = document.querySelector("#load-more-trigger");
  //   if (target) {
  //     observer.observe(target);
  //   }

  //   return () => {
  //     if (target) observer.unobserve(target);
  //   };
  // }, [loadMoreBlogs]);

  // return (
  //   <div className="p-4 lg:pt-32 md:pt-32 mx-auto w-full">
  //     <h1 className="text-white font-semibold mb-6 text-3xl md:mx-20 lg:mx-40">
  //       Blogs for {product}
  //     </h1>
  //     <div className="mx-4 md:mx-20 lg:mx-40">
  //       {blogs?.map((blog: any, index: number) => (
  //         <BlogCard
  //           key={index}
  //           title={blog.title}
  //           author={blog.author}
  //           date={blog.date}
  //           body={blog.body}
  //           readLength={blog.readLength}
  //           blogPostLink={blog._sys.filename}
  //         />
  //       ))}
  //     </div>
  //     {hasMore && <div id="load-more-trigger" className="h-20"></div>}
  //   </div>
  // );
}
