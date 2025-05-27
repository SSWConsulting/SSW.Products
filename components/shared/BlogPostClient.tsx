"use client";

import { GridPattern } from "@/components/magicui/grid-background";
import { FormattedDate } from "@/formattedDate";
import { OptionalProps } from "@/optionalProps";
import { Blog } from "@/types/blog";
import { AuthorInfo } from "@comps/AuthorInfo";
import Container from "@comps/Container";

import { Tags } from "@comps/Tags";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Blogs } from "../../tina/__generated__/types";
import { BlogCard } from "./BlogIndexClient";
interface BlogPostClientProps extends OptionalProps<FormattedDate> {
  query: string;
  variables: object;
  pageData: { blogs: Blogs };
  recentBlogs?: Blog[];
}

const articleData = {
  title: "How Ramp scaled a successful bill pay product with Increase",
  url: "https://increase.com/blog/how-ramp-scaled-bill-pay-with-increase",
  author: {
    name: "Sarah Johnson",
    role: "Content Marketing Manager",
    avatarUrl: "/mystical-forest-spirit.png",
    date: "October 15, 2023",
  },
  tags: ["Fintech", "Case Study", "Bill Pay", "API Integration"],
  tableOfContents: [
    { id: "the-problem", title: "The problem", level: 2 },
    { id: "the-solution", title: "The solution", level: 2 },
    { id: "the-result", title: "The result", level: 2 },
  ],
  relatedArticles: [
    {
      id: "1",
      title: "How Mercury built their banking platform with Increase",
      excerpt:
        "Learn how Mercury leveraged Increase's API to build their banking platform for startups.",
      imageUrl: "/interconnected-fintech.png",
      slug: "how-mercury-built-banking-platform",
    },
    {
      id: "2",
      title: "Building modern payment systems with Increase",
      excerpt:
        "A technical deep dive into building payment systems using Increase's infrastructure.",
      imageUrl: "/digital-payments-interface.png",
      slug: "building-modern-payment-systems",
    },
  ],
};

type Node = { children: Node[]; value: string; type: string; text: string };

const searchAstTree = (node: Node, targetNodes: string[]) => {
  const results: Node[] = [];
  recurseAstTree(node, targetNodes, results);
  return results;
};

const recurseAstTree = (
  node: Node,
  targetNodes: string[],
  accumulatedNodes: Node[]
) => {
  if (targetNodes.includes(node.type)) {
    accumulatedNodes.push(node);
  }
  if (!node.children) {
    return;
  }
  for (const child of node.children) {
    recurseAstTree(child, targetNodes, accumulatedNodes);
  }
};

const nodesToText = (node: Node[]) => {
  return node.map((child) => {
    const text = child.children
      .map((child) => (child.children ? child.children[0].text : child.text))
      .join(" ");

    return {
      text,
      type: child.type,
    };
  });
};

export default function BlogPostClient({
  query,
  variables,
  pageData,
  recentBlogs,
  initialFormattedDate,
}: BlogPostClientProps) {
  const { data } = useTina<{ blogs: Blogs }>({
    query,
    variables,
    data: pageData,
  });

  // const titles = searchAstTree(data.blogs.body);

  const titles = useMemo(() => {
    const titleNodes = searchAstTree(data.blogs.body, [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ]);
    const bodyTitles = nodesToText(titleNodes);
    return bodyTitles;
  }, [data.blogs.body]);

  return (
    <div className="min-h-screen text-white">
      <Container>
        {" "}
        <div className="text-sm uppercase tracking-wide text-white/60">
          {data.blogs.category}
        </div>
        <h1 className="mt-2 mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {data.blogs.title}
        </h1>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <AuthorInfo
            authorImage={data.blogs.authorImage}
            author={data.blogs.author}
            sswPeopleLink={data.blogs.sswPeopleLink}
            initialFormattedDate={initialFormattedDate}
            dynamicDate={data.blogs.date}
            readingTime={data.blogs.readLength}
          />

          {/* Tags and social sharing icons */}
          <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {data.blogs.labels && (
              <Tags
                data-tina-field={tinaField(data.blogs, "labels")}
                tags={data.blogs.labels.filter(
                  (label) => label !== null && label !== undefined
                )}
              />
            )}
          </div>
        </div>
        <div className="relative flex  z-0 overflow-hidden">
          <div className="relative aspect-video sm:w-3/4 w-4/5 mx-auto my-16 a z-20 inset-0   ">
            {/* The the mask clip border prevents an opaque border from forming around the image */}
            <Image
              alt="alt text"
              objectFit="cover"
              fill
              className="rounded-lg p-0.5 mask-b-from-60% mask-b-to-100% mask-clip-padding"
              aria-hidden="true"
              src={data.blogs.bannerImage || ""}
            />
          </div>
          <div
            className="absolute z-10 inset-0 mask-y-from-90% mask-y-to-100% mask-x-from-90% mask-x-to-100% mask-radial-[60%_100%] mask-radial-from-52 mask-radial-at-center
          "
          >
            <GridPattern
              className="bg inset-y-[-30%] skew-y-12 h-[200%] "
              strokeDasharray={"4 2"}
              squares={[
                [4, 4],
                [5, 1],
                [8, 2],
                [5, 3],
                [5, 5],
                [10, 10],
                [12, 15],
                [15, 10],
                [10, 15],
                [15, 10],
                [10, 15],
                [15, 10],
              ]}
            />
          </div>
        </div>
        {/* Article Content */}
        <div className="flex mt-8">
          {/* Main Content - Takes up 2/3 of the space on large screens */}

          <div className="flex flex-col basis-2/3">
            <div className="grow">
              <TinaMarkdown
                components={DocAndBlogMarkdownStyle}
                content={data.blogs.body}
              />
            </div>

            {/* Article navigation */}
            <div className="mb-12 flex justify-between border-t border-white/20 pt-8">
              <Link
                href="#"
                className="flex items-center text-white/60 transition-colors hover:text-ssw-red"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Article
              </Link>
              <Link
                href="#"
                className="flex items-center text-white/60 transition-colors hover:text-ssw-red"
              >
                Next Article
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar - Takes up 1/3 of the space on large screens */}
          <div className="basis-1/3">
            <div className="sticky h-[calc(100vh_-_11rem)] flex flex-col summary overflow-hidden top-32 space-y-6">
              {/* Summary Card Layout */}
              {data.blogs.summaryCard && (
                <div className="rounded-lg bg-gray-darkest [scrollbar-width:thin] [scrollbar-color:var(--color-ssw-charcoal)_transparent]  p-6 overflow-y-auto">
                  {/* Company information */}
                  <div className="[&_p]:text-white/60  [&_p] space-y-1.5 [&_li]:text-sm [&_li]:list-disc [&_p]:text-sm text-base [&_a]:text-sm [&_a]:text-ssw-red [&_a]:hover:underline">
                    <TinaMarkdown
                      content={data.blogs.summary}
                      components={{
                        li: (props: { children: ReactNode } | undefined) => (
                          <li className="list-outside ml-6 list-disc">
                            {props?.children}
                          </li>
                        ),
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Table of Contents Card */}

              {titles.length > 0 && (
                <div className="rounded-lg border shrink-0 border-white/20 [background-image:var(--gradient-black)] p-6">
                  <h3 className="mb-1 font-medium text-white">
                    Table of Contents
                  </h3>
                  <nav>
                    <ul className="text-sm">
                      {titles.map(
                        (title, index) => (
                          console.log("mappedtitle", title),
                          (
                            <li
                              className="text-white/60 group transition-colors py-1 border-l w-fit pl-2 hover:border-white border-white/10"
                              key={index}
                              style={{}}
                            >
                              <a
                                onClick={() => {
                                  const SCROLL_OFFSET = 80;
                                  const heading = document
                                    .evaluate(
                                      `//${title.type}[text()="${title.text}"]`,
                                      document,
                                      null,
                                      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                      null
                                    )
                                    .snapshotItem(0);
                                  if (!heading) return;

                                  const y =
                                    (
                                      heading as HTMLElement
                                    ).getBoundingClientRect().top +
                                    window.scrollY;
                                  window.scrollTo({
                                    top: y - SCROLL_OFFSET,
                                    behavior: "smooth",
                                  });
                                }}
                                href={`#${title.text}`}
                                className="transition-colors inset-0 group-hover:text-ssw-red"
                              >
                                {title.text}
                              </a>
                            </li>
                          )
                        )
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Related Articles - Full width */}
        {recentBlogs && (
          <div className="mt-16 border-t border-gray-800 pt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                Related Articles
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {recentBlogs.map((article, index) => {
                const {} = article;
                return (
                  <BlogCard
                    key={`blog-${index}`}
                    body={article.body}
                    date={article.date}
                    bannerImage={article.bannerImage}
                    category={""}
                    title={article.title}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
