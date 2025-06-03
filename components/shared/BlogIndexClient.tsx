"use client";
import type { Author } from "@/types/author";
import Container from "@comps/Container";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  BlogsIndexBlocksArticleList,
  BlogsIndexBlocksHeroSearch,
  BlogsIndexBlocksFeaturedBlog as FeaturedBlog,
} from "../../tina/__generated__/types";
import CallToAction from "./Blocks/CallToAction";

import { RemoveTinaMetadata } from "@/types/tina";
import { BlogCard } from "@comps/BlogCard";
import client from "../../tina/__generated__/client";
import { BlogsIndexBlocks, Maybe } from "../../tina/__generated__/types";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";
import { getBlogsForProduct } from "../../utils/fetchBlogs";
import { ALL_CATEGORY, useBlogSearch } from "../providers/BlogSearchProvider";
import { Button } from "../ui/button";
import ArticleMetadata from "./ArticleMetadata";
import CategoryLabel from "./CategoryLabel";
import GridBackground from "./GridBackground";
import ReadMore from "./ReadMore";

type BlogTinaProps = Awaited<ReturnType<typeof client.queries.blogsIndex>>;

type Block = Maybe<RemoveTinaMetadata<BlogsIndexBlocks>>;

type ArticleListProps = RemoveTinaMetadata<BlogsIndexBlocksArticleList>;

type HeroSearchProps = RemoveTinaMetadata<BlogsIndexBlocksHeroSearch>;

export const PAGE_LIMIT = 3;

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
      <div className="grow flex flex-col pb-12 gap-14 lg:gap-24 ">
        {blogsIndex.blocks && (
          <Blocks product={product} blocks={blogsIndex.blocks} />
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
  return (
    <Container>
      {featuredBlog && !searchTerm && (
        <section className="mx-auto">
          {props.title && (
            <h2
              data-tina-field={tinaField(props, "title")}
              className="w-fit text-2xl font-bold mb-8 border-l-4 border-ssw-red pl-4"
            >
              {props.title}
            </h2>
          )}
          <div className="bg-linear-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border border-white/20 rounded-xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full grow md:basis-4/12 aspect-video">
                {/* TODO: Tech debt
                  Tailwind v3 does not not have a built in image mask class https://github.com/SSWConsulting/SSW.YakShaver/issues/1817 */}
                <div className="w-full h-full lg:mask-[linear-gradient(to_right,black,black,transparent)] mask-[linear-gradient(black,black,transparent)]">
                  <GridBackground />
                </div>

                {featuredBlog.bannerImage && (
                  <div className="inset-0 flex items-center justify-center absolute">
                    <div className="h-5/6 lg:h-auto lg:w-5/6 rounded-md overflow-hidden mask-[linear-gradient(black,black,transparent)] aspect-video relative">
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
                <Author {...featuredBlog} />
                <ArticleMetadata className="" {...featuredBlog} />

                <section className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-none">
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
    </Container>
  );
};

type BlocksProps = {
  blocks: Maybe<RemoveTinaMetadata<Block>>[];
  product: string;
};

const Blocks = ({ blocks, product }: BlocksProps) => {
  return (
    <>
      {blocks.map((block) => {
        switch (block?.__typename) {
          case "BlogsIndexBlocksHeroSearch":
            return <HeroSearch {...block} />;
          case "BlogsIndexBlocksCallToAction":
            return <CallToAction className="container" {...block} />;
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
}: RemoveTinaMetadata<ArticleListProps> & { product: string }) => {
  const { searchTerm, selectedCategory } = useBlogSearch();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [`blogs${searchTerm}${selectedCategory}`],
    queryFn: ({ pageParam }) => {
      return getBlogsForProduct({
        limit: PAGE_LIMIT,
        product,
        startCursor: pageParam,
        keyword: searchTerm,
        category:
          selectedCategory === ALL_CATEGORY ? undefined : selectedCategory,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      const lastEntry =
        lastPage.edges && lastPage.edges[lastPage.edges.length - 1];
      return lastEntry?.cursor || undefined;
    },
  });

  return (
    <Container>
      {props.title && !searchTerm && (
        <h2
          data-tina-field={tinaField(props, "title")}
          className="text-2xl font-bold mb-8 border-l-4 border-ssw-red pl-4 w-fit"
        >
          {props.title}
        </h2>
      )}

      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-8">
        {data?.pages.map((page) =>
          page?.edges?.map((edge, index) => {
            const post = edge?.node;

            return (
              post && (
                <BlogCard
                  key={`blog-${index}`}
                  category={post.category}
                  body={post.body}
                  bannerImage={post.bannerImage}
                  date={post.date}
                  groupHover={false}
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
      </div>

      <div className="text-center mt-6">
        {data?.pages[data.pages.length - 1].pageInfo.hasPreviousPage && (
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
    </Container>
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
          className="object-cover"
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
              placeholder="Search articles..."
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
