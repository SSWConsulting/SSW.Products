"use client";

import { GridPattern } from "@/components/magicui/grid-background";
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
import { ALL_CATEGORY, useBlogSearch } from "../providers/BlogSearchProvider";
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

const GridBackground = () => {
  return (
    <GridPattern
      stroke="2rem"
      className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
      strokeDasharray={"4 2"}
      width={30}
      height={30}
    />
  );
};

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
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full flex-grow md:basis-4/12 aspect-video">
                  <div className="bg-ssw-charcoal absolute drop-shadow-sm z-10 w-fit m-3 text-white text-xs px-3 py-1 rounded-full">
                    {"Uncategorized"}
                  </div>
                  {/* TODO: Tech debt
                  Tailwind v3 does not not have a built in image mask class https://github.com/SSWConsulting/SSW.YakShaver/issues/1817 */}
                  <div className="w-full h-full md:[mask-image:linear-gradient(to_right,black,black,transparent)] [mask-image:linear-gradient(black,black,transparent)]">
                    <GridBackground />
                  </div>

                  {featuredBlog.bannerImage && (
                    <div className="inset-0 flex items-center justify-center absolute">
                      <div className="h-5/6 md:h-auto md:w-5/6 rounded-md overflow-hidden [mask-image:linear-gradient(black,black,transparent)] aspect-video relative">
                        <Image
                          aria-hidden={true}
                          src={featuredBlog.bannerImage}
                          alt={""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-8 md:basis-8/12">
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
                  </div>
                  <Link href={`/blog/${featuredBlog._sys.filename}`}>
                    <h3 className="text-2xl font-bold mb-4 hover:text-ssw-red transition-colors">
                      {featuredBlog?.title}
                    </h3>
                  </Link>
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
                          src={
                            featuredBlog.authorImage ||
                            "/default-images/Placeholder-profile.png"
                          }
                          alt="placeholder blog author"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {featuredBlog?.sswPeopleLink ? (
                            <Link
                              className="hover:underline"
                              href={featuredBlog.sswPeopleLink}
                            >
                              {featuredBlog?.author}
                            </Link>
                          ) : (
                            <>{featuredBlog?.author}</>
                          )}
                        </p>

                        {/*
                TODO: Add author roles? (Could use cronjob from SSW People)
                
                <p className="text-gray-500 text-xs">{featuredPost.author.role}</p> */}
                      </div>
                    </div>
                    <Link href="/blog/ai-transforming-issue-reporting">
                      <Button variant={"default"}>Read Article</Button>
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
  const { searchTerm, selectedCategory } = useBlogSearch();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [`blogs${searchTerm}${selectedCategory}`],
    queryFn: ({ pageParam }) => {
      return getBlogsForProduct({
        limit: 3,
        product,
        endCursor: pageParam,
        keyword: searchTerm,
        category:
          selectedCategory === ALL_CATEGORY ? undefined : selectedCategory,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
  });

  return (
    <section className="container mx-auto py-12">
      {props.title && !searchTerm && (
        <h2
          data-tina-field={tinaField(props, "title")}
          className="text-2xl font-bold mb-8 border-l-4 border-[#c41414] pl-4 w-fit"
        >
          {props.title}
        </h2>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.pages.map((page) =>
          page?.edges?.map((edge, index) => {
            const post = edge?.node;
            return (
              <div
                key={index}
                className="border bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-full flex flex-col flex-grow flex-shrink-0">
                  <div className="relative aspect-video ">
                    <div className="text-white z-20 absolute text-xs w-fit drop-shadow-sm m-3 px-3 py-1 h-fit bg-ssw-charcoal rounded-full">
                      {edge?.node?.category || "Uncategorized"}
                    </div>
                    <div className="inset-0 absolute align-middle items-center justify-center flex">
                      {edge?.node?.bannerImage && (
                        <div className="rounded-md [mask-image:linear-gradient(black,black,transparent)] z-10 h-5/6 relative overflow-hidden aspect-video">
                          <Image
                            alt=""
                            fill
                            objectFit="cover"
                            aria-hidden={true}
                            src={edge?.node?.bannerImage}
                          />
                        </div>
                      )}
                    </div>
                    <div className="w-full h-full [mask-image:linear-gradient(black,black,transparent)]">
                      <GridBackground />
                    </div>
                  </div>
                  <div className="flex-grow flex-shrink-0 flex flex-col p-6">
                    <div className="flex flex-col gap-3 mb-3 text-xs text-gray-400">
                      <section className="flex gap-3">
                        <div className="flex gap-3 items-center">
                          <div className="size-8 items-center relative rounded-full overflow-hidden">
                            <Image
                              src={
                                edge?.node?.authorImage ||
                                "/default-images/Placeholder-profile.png"
                              }
                              alt="placeholder blog author"
                              fill
                              objectFit="cover"
                            />
                          </div>
                          <p className="font-medium h-fit text-sm">
                            {edge?.node?.sswPeopleLink ? (
                              <Link
                                className="hover:underline"
                                href={edge.node.sswPeopleLink}
                              >
                                {edge?.node?.author}
                              </Link>
                            ) : (
                              <>{edge?.node?.author}</>
                            )}
                          </p>
                        </div>
                      </section>
                      <section className="flex items-center gap-3">
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
                      </section>
                    </div>
                    <Link
                      className="w-fit"
                      href={`/blog/${post?._sys.filename}`}
                    >
                      <h3 className="text-xl font-bold mb-3 hover:text-ssw-red transition-colors">
                        {post?.title}
                      </h3>
                    </Link>
                    <section className="text-gray-300 text-sm mb-4 line-clamp-2">
                      <TinaMarkdown content={post?.body} />
                    </section>
                    <Link
                      href={`/blog/${post?._sys.filename}`}
                      className="text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
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
  const {
    updateSearchTerm,
    categories,
    setSelectedCategory,
    selectedCategory,
  } = useBlogSearch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (updateSearchTerm) updateSearchTerm(searchTerm);
    }, debounceTime);
    return () => clearTimeout(timeout);
  }, [searchTerm, updateSearchTerm]);

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
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory(category);
                }}
                variant={category === selectedCategory ? "default" : "ghost"}
                key={`button ${index}`}
              >
                {category || ALL_CATEGORY}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CallToAction = (props: CallToActionProps) => {
  return (
    <section className="container mx-auto py-24">
      <div className="rounded-2xl bg-[#131313] relative">
        <div className="max-w-3xl mx-auto text-center ">
          <section className="p-6 z-10 relative">
            {props.title && (
              <h2
                data-tina-field={tinaField(props, "title")}
                className="sm:text-3xl text-xl font-bold mb-4"
              >
                {props.title}
              </h2>
            )}
            {props.description && (
              <p
                data-tina-field={tinaField(props, "description")}
                className="text-gray-300 text-sm sm:text-base mb-8"
              >
                {props.description}
              </p>
            )}

            {props.button && (
              <ShinyButton
                data-tina-field={tinaField(props, "button")}
                className="bg-gradient-to-br from-red-500 to-red-800 text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0"
                href={props.button.buttonLink || ""}
              >
                {props?.button?.buttonText}
              </ShinyButton>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};
