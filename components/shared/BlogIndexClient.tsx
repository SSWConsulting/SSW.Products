"use client";

import { GridPattern } from "@/components/magicui/grid-background";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import Image from "next/image";
import React from "react";
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

import { cn } from "@/lib/utils";
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

export const PAGE_LIMIT = 3;

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
          {props.title && (
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

              <div className="p-8 md:basis-8/12 flex gap-3 flex-col">
                {featuredBlog.category && (
                  <CategoryLabel className="text-sm">
                    {featuredBlog.category}
                  </CategoryLabel>
                )}
                <Link href={`/blog/${featuredBlog._sys.filename}`}>
                  <h3 className="sm:text-2xl text-xl font-bold hover:text-ssw-red transition-colors">
                    {featuredBlog?.title}
                  </h3>
                </Link>
                <div className="flex sm:flex-row gap-3 flex-col text-sm md:text-base">
                  <Author {...featuredBlog} />
                  <ArticleMetadata className="" {...featuredBlog} />
                </div>

                <section className="text-gray-300 text-sm sm:text-base mb-6 line-clamp-2 sm:line-clamp-none">
                  <TinaMarkdown
                    content={extractBlurbAsTinaMarkdownContent(
                      featuredBlog?.body,
                      2
                    )}
                  />
                </section>
                <div className="flex justify-between items-center">
                  <ReadMore fileName={featuredBlog._sys.filename || ""} />
                </div>
              </div>
            </div>
          </div>
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

const ArticleMetadata = ({
  date,
  readLength,
  className,
}: {
  date?: string | null;
  readLength?: string | null;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-1 text-gray-400", className)}>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 gap-0.5" />
        <span>{date && formatDate(date)}</span>
      </div>
      <span>•</span>
      <div className="flex items-center gap-0.5">
        <Clock className="h-4 w-4" />
        <span>{readLength}</span>
      </div>
    </div>
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
        limit: PAGE_LIMIT,
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

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                  <div className="flex-grow flex-shrink-0 gap-3 flex flex-col p-6">
                    {edge?.node?.category && (
                      <CategoryLabel className="text-sm">
                        {edge?.node?.category}
                      </CategoryLabel>
                    )}
                    <Link
                      className="w-fit"
                      href={`/blog/${post?._sys.filename}`}
                    >
                      <h3 className="text-xl font-bold text-gray-100 hover:text-ssw-red transition-colors">
                        {post?.title}
                      </h3>
                    </Link>
                    <div className="flex text-sm flex-col sm:flex-row gap-3 sm:items-center ">
                      <Author
                        author={edge?.node?.author}
                        authorImage={edge?.node?.authorImage}
                        sswPeopleLink={edge?.node?.sswPeopleLink}
                      />
                      <ArticleMetadata
                        className="h-fit"
                        date={edge?.node?.date}
                        readLength={edge?.node?.readLength}
                      />
                    </div>

                    <section className="text-gray-300 text-sm mb-4 line-clamp-2">
                      <TinaMarkdown content={post?.body} />
                    </section>
                    <ReadMore fileName={post?._sys.filename || ""} />
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

const CategoryLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-ssw-charcoal drop-shadow-sm z-10 w-fit text-white px-3 py-1 rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
};

const ReadMore = ({ fileName }: { fileName: string }) => {
  return (
    <Link
      href={`/blog/${fileName}`}
      className="text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1"
    >
      Read More <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

const Author = ({
  authorImage,
  sswPeopleLink,
  author,
}: {
  authorImage?: string | null;
  sswPeopleLink?: string | null;
  author?: string | null;
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="size-8 items-center relative rounded-full overflow-hidden">
        <Image
          src={authorImage || "/default-images/Placeholder-profile.png"}
          alt="placeholder blog author"
          fill
          objectFit="cover"
        />
      </div>
      <p className="font-medium h-fit">
        {sswPeopleLink ? (
          <Link className="hover:underline" href={sswPeopleLink}>
            {author}
          </Link>
        ) : (
          <>{author}</>
        )}
      </p>
    </div>
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
    <section className=" relative bg-gradient-to-b py-16 bg-[#131313]">
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
        <div className="relative max-w-xl mx-auto">
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
        {props.showCategories && (
          <div className="flex flex-wrap gap-3 justify-center mt-8">
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
        )}
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
