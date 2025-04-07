"use client";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import Image from "next/image";
import {
  BlogsIndexBlocksArticleList as ArticleListProps,
  BlogsIndexBlocksCallToAction as CallToActionProps,
  BlogsIndexBlocksHeroSearch as HeroSearchProps,
} from "../../tina/__generated__/types";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BlogsIndexBlocksFeaturedBlog as FeaturedBlog } from "../../tina/__generated__/types";

import client from "../../tina/__generated__/client";
import {
  BlogsIndexBlocks as Block,
  Maybe,
} from "../../tina/__generated__/types";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";
import { getBlogsForProduct } from "../../utils/fetchBlogs";
import { useBlogSearch } from "../providers/BlogSearchProvider";
import { Button } from "../ui/button";

type BlogTinaProps = Awaited<ReturnType<typeof client.queries.blogsIndex>>;

const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};

interface BlogIndexClientProps {
  product: string;
}

export default function BlogIndexClient({
  data: pageData,
  query,
  variables,
  product,
}: BlogIndexClientProps & BlogTinaProps) {
  const blogData = useTina({
    data: pageData,
    query,
    variables,
  });

  const blogsIndex = blogData.data.blogsIndex;

  // const categories = [
  //   "All Posts",
  //   "Productivity",
  //   "AI",
  //   "Templates",
  //   "Best Practices",
  //   "Case Studies",
  //   "Research",
  //   "Product Updates",
  // ];

  return (
    <>
      <div className="grow">
        {blogsIndex.blocks && (
          <Blocks product={product} blocks={blogsIndex.blocks} />
        )}
      </div>
    </>
  );

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

const FeaturedArticle = ({ featuredBlog, ...props }: FeaturedBlog) => {
  const { searchTerm } = useBlogSearch();
  return (
    <>
      {featuredBlog && !searchTerm && (
        <section className="py-12 container mx-auto">
          <section className="">
            {featuredBlog.title && (
              <h2
                data-tina-field={tinaField(props, "title")}
                className="w-fit text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4"
              >
                {props.title}
              </h2>
            )}
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
                      <span>
                        {featuredBlog?.date && formatDate(featuredBlog.date)}
                      </span>
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
                      {featuredBlog?.title}
                    </h3>
                  </Link>
                  {/* TODO: add excerpt */}
                  <section className="text-gray-300 mb-6">
                    <TinaMarkdown
                      content={extractBlurbAsTinaMarkdownContent(
                        featuredBlog?.body,
                        2
                      )}
                    />
                  </section>
                  <div className="flex justify-between items-center">
                    <div className="flex  items-center gap-3">
                      <div className="size-8 relative rounded-full overflow-hidden">
                        <Image
                          src={"/default-images/Placeholder-profile.png"}
                          alt="placeholder blog author"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {featuredBlog?.author}
                        </p>

                        {/*
                TODO: Add author roles? (Could use cronjob from SSW People)
                
                <p className="text-gray-500 text-xs">{featuredPost.author.role}</p> */}
                      </div>
                    </div>
                    <Link href="/blog/ai-transforming-issue-reporting">
                      <Button className="bg-[#c41414] hover:bg-[#a51212] text-white">
                        Read Article
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  );
};

type BlocksProps = {
  blocks: Maybe<Block>[];
  product: string;
};

const Blocks = ({ blocks, product }: BlocksProps) => {
  return (
    <>
      {blocks.map((block) => {
        switch (block?.__typename) {
          case "BlogsIndexBlocksHeroSearch":
            if (block?.__typename === "BlogsIndexBlocksHeroSearch") {
              return <HeroSearch {...block} />;
            }
            return null;
          case "BlogsIndexBlocksCallToAction":
            return <CallToAction {...block} />;
          case "BlogsIndexBlocksArticleList":
            return <RecentArticles {...block} product={product} />;

          case "BlogsIndexBlocksFeaturedBlog":
            return <FeaturedArticle {...block} />;
          default:
            return <></>;
        }
      })}
    </>
  );
};

const RecentArticles = ({
  product,
  ...props
}: ArticleListProps & { product: string }) => {
  const { searchTerm } = useBlogSearch();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [`blogs${searchTerm}`],
    queryFn: ({ pageParam }) => {
      return getBlogsForProduct({
        product,
        endCursor: pageParam,
        keyword: searchTerm,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
  });

  return (
    <section className="container mx-auto py-12">
      {props.title && (
        <h2
          data-tina-field={tinaField(props, "title")}
          className="text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4 w-fit"
        >
          {props.title}
        </h2>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {data?.pages.map((page) =>
          page?.edges?.map((edge, index) => {
            const post = edge?.node;
            return (
              <div
                key={index}
                className="border bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
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
                  <Link className="w-fit" href={`/blog/${post?._sys.filename}`}>
                    <h3 className="text-xl font-bold mb-3 hover:text-ssw-red transition-colors">
                      {post?.title}
                    </h3>
                  </Link>
                  <section className="text-gray-300 text-sm mb-4">
                    <TinaMarkdown
                      content={extractBlurbAsTinaMarkdownContent(post?.body, 3)}
                    />
                  </section>
                  <Link
                    href={`/blog/${post?._sys.filename}`}
                    className="text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-center mt-12">
        {data?.pages[data.pages.length - 1].pageInfo.hasNextPage && (
          <Button
            onClick={() => {
              fetchNextPage();
            }}
            variant={"secondary"}
          >
            Load More Articles
          </Button>
        )}
      </div>
    </section>
  );
};

const HeroSearch = (props: HeroSearchProps) => {
  const debounceTime = 1000;

  const { updateSearchTerm } = useBlogSearch();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (updateSearchTerm) updateSearchTerm(searchTerm);
    }, debounceTime);
    return () => clearTimeout(timeout);
  }, [searchTerm, updateSearchTerm]);
  const categories = [
    "All Posts",
    "Productivity",
    "AI",
    "Templates",
    "Best Practices",
    "Case Studies",
    "Research",
    "Product Updates",
  ];

  return (
    <section className=" relative py-16  bg-gradient-to-b bg-[#131313]">
      <div className="mx-auto container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          {props.title && (
            <h1
              data-tina-field={tinaField(props, "title")}
              className="text-4xl font-bold  mb-4"
            >
              {props.title}
            </h1>
          )}

          {props.description && (
            <p
              className="text-xl text-gray-300"
              data-tina-field={tinaField(props, "description")}
            >
              {props.description}
            </p>
          )}
        </div>

        <div className="relative max-w-xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search articles..."
              className="w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-3 px-4 pl-12 placeholder:text-gray-300 focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((category, index) => {
            return (
              <Button
                variant={index === 0 ? "default" : "ghost"}
                key={`button ${index}`}
              >
                {category}
              </Button>
            );
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
  );
};

const CallToAction = (props: CallToActionProps) => {
  return (
    <section className=" container mx-auto py-16 ">
      <div className="rounded-2xl md:p-12 bg-[#131313] relative">
        <section className="px-6 pt-6 pb-0 2xl:pb-6">
          <div className="max-w-3xl mx-auto text-center ">
            {props.title && (
              <h2 className="sm:text-3xl text-xl font-bold mb-4">
                {props.title}
              </h2>
            )}
            {props.description && (
              <p className="text-gray-300 text-sm sm:text-base mb-8">
                {props.description}
              </p>
            )}

            {props.button && (
              <ShinyButton
                className="bg-gradient-to-br from-red-500 to-red-800 text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0"
                href={props.button.buttonLink || ""}
              >
                {props?.button?.buttonText}
              </ShinyButton>
            )}

            {props.image?.image && (
              <div className="2xl:absolute mx-auto 2xl:right-0 translate-x-0.5 bottom-0 size-72 sm:size-96">
                <div className="h-full relative size-72 sm:size-96 aspect-1">
                  <Image
                    alt={""}
                    className="object-bottom"
                    objectFit="contain"
                    fill
                    src={props.image?.image}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};
