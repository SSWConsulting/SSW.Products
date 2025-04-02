
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import NavBarServer from "../../../components/shared/NavBarServer";
import { ShinyButton } from "../../../components/shiny-button";
import { Button } from "../../../components/ui/button";
import client from "../../../tina/__generated__/client";
import { extractBlurbAsTinaMarkdownContent } from "../../../utils/extractBlurbAsTinaMarkdownContent";
import { getBlogsForProduct } from "../../../utils/fetchBlogs";



const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
}
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

  const blogs = await getBlogsForProduct(params.product);
  
  const featuredBlog = blogs.data[0];



  const blogPosts = blogs.data.filter((post)=> { 
    return post?.title != featuredBlog?.title 
  }).slice(0, 3)  

  // const featuredPost = {

  // }  
  // const featuredPost = {
  //   title: "How AI is Transforming Issue Reporting and Team Productivity",
  //   excerpt:
  //     "Discover how artificial intelligence is revolutionizing the way teams capture, document, and resolve issues.",
  //   image: "/placeholder.svg?height=600&width=1200&text=Featured+Blog+Post",
  //   date: "March 5, 2025",
  //   readTime: "8 min read",
  //   author: {
  //     name: "Sarah Johnson",
  //     role: "Head of Product",
  //     avatar: "/placeholder.svg?height=100&width=100",
  //   },
  //   category: "Productivity",
  // }


  //   const recentPosts = [
  //   {
  //     title: "5 Issue Reporting Templates Every Team Should Use",
  //     excerpt:
  //       "Streamline your issue reporting with these proven templates that keep documentation focused and productive.",
  //     image: "/placeholder.svg?height=400&width=600&text=Issue+Templates",
  //     date: "February 28, 2025",
  //     readTime: "6 min read",
  //     category: "Templates",
  //   },
  //   {
  //     title: "The Real Cost of Inefficient Issue Reporting (And How to Fix It)",
  //     excerpt:
  //       "Research shows the average professional spends 31 hours monthly in unproductive issue documentation. Here's how to reclaim that time.",
  //     image: "/placeholder.svg?height=400&width=600&text=Issue+Costs",
  //     date: "February 21, 2025",
  //     readTime: "5 min read",
  //     category: "Research",
  //   },
  //   {
  //     title: "How to Report Issues That Actually Get Resolved",
  //     excerpt: "Remote work is here to stay. Learn how to make your issue reporting more effective and actionable.",
  //     image: "/placeholder.svg?height=400&width=600&text=Effective+Reporting",
  //     date: "February 14, 2025",
  //     readTime: "7 min read",
  //     category: "Best Practices",
  //   },
  // ]

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


  return <div className="min-h-screen bg-gray-950 text-gray-100">
  
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

  <NavBarServer product={params.product} />
  <section className="relative py-16 bg-gradient-to-b from-gray-950 to-gray-900">
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">YakShaver.ai Blog</h1>
        <p className="text-xl text-gray-300">
          Insights, tips, and stories about issue reporting and AI-powered productivity
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-16">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c41414] focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-16">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={"primary"}
            className={
              index === 0
                ? "bg-[#c41414] hover:bg-[#a51212] text-white"
                : "border-gray-700 text-gray-300 hover:border-[#c41414]/50 hover:text-[#c41414]"
            }
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  </section>

  {/* Featured Post */}


  {featuredBlog && <>
  <section className="py-12 bg-gray-950">
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4">Featured Article</h2>
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
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
              <div className="bg-[#c41414] text-white text-xs px-3 py-1 rounded-full">
              {"Uncategorized"}
            </div>
            </div>
            <Link href="/blog/ai-transforming-issue-reporting">
              <h3 className="text-2xl font-bold mb-4 hover:text-[#c41414] transition-colors">
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
      {blogPosts.map((post, index) => (
        <div
          key={index}
          className=" border bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* <div className="relative h-48">
            {/*
            
            
            // TODO: add blog post images
            <Image src={post.image || "/default-images/Placeholder-profile.png"} alt={post.title} fill className="object-cover" /> 
            
          </div> */}
          <div className="p-6 h-full flex flex-col flex-grow">
            
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">


              {post?.date && <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post?.date)}</span>
                </div>

              }
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post?.readLength}</span>
              </div>
              <div className="bg-ssw-charcoal text-white text-xs px-3 py-1 rounded-full">
                {"Uncategorized"}
              </div>
              
            </div>
            <Link
              className="w-fit"
              href={`/blog/${index === 0 ? "issue-templates" : index === 1 ? "cost-of-inefficient-reporting" : "effective-issue-reporting"}`}
            >
              <h3 className="text-xl font-bold mb-3 hover:text-ssw-red transition-colors">{post?.title}</h3>
            </Link>
          

              <section className="text-gray-300 text-sm mb-4">
            <TinaMarkdown content={extractBlurbAsTinaMarkdownContent(post?.body, 3)}  />

            </section>
            <Link

              href={`/blog/${post?._sys.filename}`}
              className="text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1"
            >
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-12">
      <Button className="bg-gray-800 hover:bg-gray-700 text-white">View All Articles</Button>
    </div>
  </section>

  {/* Newsletter */}
  <section className="container mx-auto px-4 py-16">
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
        <p className="text-gray-300 mb-8">
          Get the latest articles, product updates, and productivity tips delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c41414] focus:border-transparent"
          />
          <ShinyButton className="px-6 py-3 bg-[#c41414]">Subscribe</ShinyButton>
        </div>
        <p className="text-gray-500 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="container mx-auto px-4 py-12 border-t border-gray-800">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0">
        <span className="font-bold text-xl">YakShaver.ai</span>
      </div>
      <div className="flex gap-6 text-sm text-gray-400">
        <a href="#" className="hover:text-white">
          Privacy
        </a>
        <a href="#" className="hover:text-white">
          Terms
        </a>
        <a href="#" className="hover:text-white">
          Contact
        </a>
        <a href="#" className="hover:text-white">
          © 2025
        </a>
      </div>
    </div>
  </footer>
</div>
}
