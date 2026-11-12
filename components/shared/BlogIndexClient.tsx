"use client";
import Container from "@comps/Container";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  BlogsIndexBlocksArticleList,
  BlogsIndexBlocksHeroSearch,
  BlogsIndexBlocksFeaturedBlog as FeaturedBlog,
} from "../../tina/__generated__/types";
import CallToAction from "./Blocks/CallToAction";

import { RemoveTinaMetadata } from "@/types/tina";
import { BlogCard, SkeletonCard } from "@comps/BlogCard";
import type client from "../../tina/__generated__/client";
import { BlogsIndexBlocks, Maybe } from "../../tina/__generated__/types";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";
import { getFeaturedBlogTitles } from "../../utils/featuredBlogTitles";
import { getBlogListEmptyMessage } from "../../utils/blogListEmptyMessage";
import { ALL_CATEGORY, useBlogSearch } from "../providers/BlogSearchProvider";
import type { BlogsResponse } from "../../utils/fetchBlogs";
import { Button } from "../ui/button";
import ArticleMetadata from "./ArticleMetadata";
import Author from "./Author";
import CategoryLabel from "./CategoryLabel";
import GridBackground from "./GridBackground";
import { useContextualLink } from "@utils/contextualLink";
import { isUncategorized } from "@utils/category";

type BlogTinaProps = Awaited<ReturnType<typeof client.queries.blogsIndex>>;

type Block = Maybe<RemoveTinaMetadata<BlogsIndexBlocks>>;

type ArticleListProps = RemoveTinaMetadata<BlogsIndexBlocksArticleList>;

type HeroSearchProps = RemoveTinaMetadata<BlogsIndexBlocksHeroSearch>;

interface BlogIndexClientProps {
  product: string;
  locale?: string;
}

export default function BlogIndexClient({
  data: pageData,
  query,
  variables,
  product,
  locale,
}: BlogIndexClientProps & BlogTinaProps) {
  const blogData = useTina({
    data: pageData,
    query,
    variables,
  });

  const blogsIndex = blogData.data.blogsIndex;

  return (
    <>
      <div className="grow flex flex-col pb-12 gap-14 lg:gap-24 ">
        {blogsIndex.blocks && (
          <Blocks product={product} locale={locale} blocks={blogsIndex.blocks} />
        )}
      </div>
    </>
  );
}

const FeaturedArticle = ({
  featuredBlog,
  ...props
}: RemoveTinaMetadata<FeaturedBlog>) => {
  const { searchTerm } = useBlogSearch();
  const contextualHref = useContextualLink();
  const blogUrl = featuredBlog
    ? contextualHref(`/blog/${featuredBlog._sys.filename}`)
    : "";
  return (
    <>
      {featuredBlog && !searchTerm && (
        <Container className="w-full">
          <section className="mx-auto">
            {props.title && (
              <h2
                data-tina-field={tinaField(props, "title")}
                className="w-fit text-2xl font-bold mb-8 border-l-4 border-ssw-red pl-4"
              >
                {props.title}
              </h2>
            )}
            {/* The featured card keeps its own box so it stands out from the
                grid, but shares the grid card's order, author and hover (#874) */}
            <div className="group relative bg-linear-to-r to-[#141414] via-[#131313] from-[#0e0e0e] rounded-xl overflow-hidden shadow-xl">
              {/* the title already links to the post; hide this full-card
                  overlay link from assistive tech so it isn't announced twice */}
              <Link
                href={blogUrl}
                className="absolute inset-0 z-20"
                aria-hidden
                tabIndex={-1}
              />
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full grow md:basis-4/12 aspect-video">
                  <div className="w-full h-full lg:mask-to-right mask-to-bottom">
                    <GridBackground />
                  </div>

                  {featuredBlog.bannerImage && (
                    <div className="inset-0 flex items-center justify-center absolute">
                      <div className="h-5/6 lg:h-auto lg:w-5/6 rounded-md overflow-hidden mask-to-bottom aspect-video relative transition-transform duration-700 group-hover:scale-105">
                        <Image
                          priority={true}
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
                  {!isUncategorized(featuredBlog.category) && (
                    <CategoryLabel>{featuredBlog.category}</CategoryLabel>
                  )}
                  <Link className="w-fit" href={blogUrl}>
                    <h3 className="sm:text-2xl text-xl font-bold group-hover:text-ssw-red transition-colors">
                      {featuredBlog?.title}
                    </h3>
                  </Link>

                  <section className="text-gray-300 text-base line-clamp-3 md:line-clamp-none">
                    <TinaMarkdown
                      content={extractBlurbAsTinaMarkdownContent(
                        featuredBlog?.body,
                        2
                      )}
                      // the whole card links to the post, so a link in the
                      // blurb couldn't be clicked: show it as text (#858)
                      components={{
                        a: (props: { children: ReactNode } | undefined) => (
                          <span>{props?.children}</span>
                        ),
                      }}
                    />
                  </section>
                  {/* author and date under the blurb, like the grid cards */}
                  <div className="mt-auto pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <Author {...featuredBlog} />
                    <ArticleMetadata {...featuredBlog} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      )}
    </>
  );
};

type BlocksProps = {
  blocks: Maybe<RemoveTinaMetadata<Block>>[];
  product: string;
  locale?: string;
};

const Blocks = ({ blocks, product, locale }: BlocksProps) => {
  const featuredTitles = getFeaturedBlogTitles(blocks);
  return (
    <>
      {blocks.map((block) => {
        switch (block?.__typename) {
          case "BlogsIndexBlocksHeroSearch":
            return <HeroSearch {...block} />;
          case "BlogsIndexBlocksCallToAction":
            return <CallToAction className="container" {...block} />;
          case "BlogsIndexBlocksArticleList":
            return (
              <RecentArticles
                {...block}
                product={product}
                locale={locale}
                featuredTitles={featuredTitles}
              />
            );
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
  locale,
  featuredTitles,
  ...props
}: RemoveTinaMetadata<ArticleListProps> & {
  product: string;
  locale?: string;
  featuredTitles?: string[];
}) => {
  const { searchTerm, selectedCategory } = useBlogSearch();
  const { data, fetchNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteQuery({
      queryKey: [`blogs${searchTerm}${selectedCategory}${locale || 'en'}`],
      queryFn: async ({ pageParam }) => {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product,
            startCursor: pageParam || undefined,
            // The first page stays small; "Load All" brings in
            // every remaining article at once
            loadAll: Boolean(pageParam),
            keyword: searchTerm || undefined,
            category:
              selectedCategory === ALL_CATEGORY ? undefined : selectedCategory,
            locale,
            // The featured post sits above this list, so leave it out to avoid
            // showing it twice (#550). It's hidden while searching, so let a
            // search still find it.
            excludeTitles: searchTerm ? undefined : featuredTitles,
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json() as Promise<BlogsResponse>;
      },
      initialPageParam: "",
      getNextPageParam: (lastPage) => {
        const lastEntry =
          lastPage.blogs && lastPage.blogs[lastPage.blogs.length - 1];
        return lastEntry?.cursor || undefined;
      },
    });
  const totalPages = data?.pages.length || 0;
  const lastPage = data?.pages[totalPages - 1];
  const remainingPages = lastPage?.remainingPages || 0;
  const hasMoreBlogs = remainingPages > 0;
  const emptyMessage =
    isLoading || isFetchingNextPage
      ? null
      : getBlogListEmptyMessage({
          pages: data?.pages,
          isFiltering:
            Boolean(searchTerm) ||
            (Boolean(selectedCategory) && selectedCategory !== ALL_CATEGORY),
          hasFeaturedPost: Boolean(featuredTitles?.length),
        });

  return (
    <Container className="w-full">
      {props.title && !searchTerm && (
        <h2
          data-tina-field={tinaField(props, "title")}
          className="text-2xl font-bold mb-8 border-l-4 border-ssw-red pl-4 w-fit"
        >
          {props.title}
        </h2>
      )}
      {emptyMessage ? (
        <span className="mx-auto block w-fit">{emptyMessage}</span>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {data?.pages.map((page) =>
            page?.blogs?.map((edge, index) => {
              const post = edge?.node;
              return (
                post && (
                  <BlogCard
                    key={`blog-${index}`}
                    category={post.category}
                    body={post.body}
                    bannerImage={post.bannerImage}
                    date={post.date}
                    groupHover
                    readLength={post.readLength}
                    title={post.title}
                    author={{
                      author: post.author,
                      authorImage: post.authorImage,
                      sswPeopleLink: post.sswPeopleLink || "",
                    }}
                    slug={post._sys.filename}
                  />
                )
              );
            })
          )}

          {isFetchingNextPage && <PlaceholderCards cards={remainingPages} />}
          {isLoading && <PlaceholderCards cards={3} />}
        </div>
      )}
      <div className="text-center mt-6">
        {(hasMoreBlogs || isLoading) && (
          <Button
            disabled={isFetching}
            onClick={() => {
              fetchNextPage();
            }}
            className="gap-1"
            variant={"secondary"}
          >
            {isFetching ? (
              <>
                Loading <LoaderCircle className="animate-spin animate size-4" />
              </>
            ) : (
              <>Load All</>
            )}
          </Button>
        )}
        {/* )} */}
      </div>
    </Container>
  );
};

type PlaceholderCardsProps = {
  cards: number;
};
const PlaceholderCards = ({ cards }: PlaceholderCardsProps) => {
  return Array.from({ length: cards }).map((_, index) => (
    <SkeletonCard key={`skeleton-${index}`} />
  ));
};

const HeroSearch = (props: RemoveTinaMetadata<HeroSearchProps>) => {
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
    <section className="relative bg-linear-to-b py-16 bg-[#131313]">
      <Container>
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
            {/*TODO: remove important https://github.com/tailwindlabs/tailwindcss/discussions/17239*/}

            <input
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search the blog…"
              className="w-full bg-ssw-charcoal placeholder:text-gray-300! border text-white border-white/20 rounded-lg py-3 px-4 pl-12 focus:outline-hidden"
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
      </Container>
    </section>
  );
};
