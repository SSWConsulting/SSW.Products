"use client";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { GridPattern } from "@/components/magicui/grid-background";
import { FormattedDate } from "@/formattedDate";
import { cn } from "@/lib/utils";
import { OptionalProps } from "@/optionalProps";
import { Blog } from "@/types/blog";
import { AuthorInfo } from "@comps/AuthorInfo";
import { BlogCard } from "@comps/BlogCard";
import Container from "@comps/Container";
import { TableOfContents } from "@comps/TableOfContents";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { nodesToText, searchAstTree } from "@utils/astHelpers";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Blogs } from "../../tina/__generated__/types";

interface BlogPostClientProps extends OptionalProps<FormattedDate> {
  query: string;
  variables: object;
  pageData: { blogs: Blogs };
  recentBlogs?: Blog[];
  nextBlog?: Blog;
  previousBlog?: Blog;
}

type Title = {
  text: string;
  type: string;
};

export default function BlogPostClient({
  query,
  variables,
  pageData,
  recentBlogs,
  previousBlog,
  nextBlog,
  initialFormattedDate,
}: BlogPostClientProps) {
  const { data } = useTina<{ blogs: Blogs }>({
    query,
    variables,
    data: pageData,
  });

  const [contentsOpen, setContentsOpen] = useState(false);
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

  const showPanel = titles.length > 0 || data.blogs.summaryCard;

  return (
    <div className="min-h-screen text-white pb-12 pt-20">
      <Container className="w-full">
        {" "}
        <div
          data-tina-field={tinaField(data.blogs, "category")}
          className="text-sm uppercase w-fit tracking-wide mb-3 text-white/60"
        >
          {data.blogs.category}
        </div>
        <h1
          data-tina-field={tinaField(data.blogs, "title")}
          className="text-3xl w-fit mb-3 font-bold text-white md:text-4xl lg:text-5xl "
        >
          {data.blogs.title}
        </h1>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <AuthorInfo
            data-tina-field={tinaField(data.blogs, "author")}
            authorImage={data.blogs.authorImage}
            author={data.blogs.author}
            sswPeopleLink={data.blogs.sswPeopleLink}
            initialFormattedDate={initialFormattedDate}
            dynamicDate={data.blogs.date}
            readingTime={data.blogs.readLength}
          />
        </div>
      </Container>
      <div className="relative flex  z-0 overflow-hidden">
        <div
          data-tina-field={tinaField(data.blogs, "bannerImage")}
          className="relative aspect-video lg:w-1/2 w-4/5 mx-auto my-16 a z-20 inset-0   "
        >
          <Image
            alt="alt text"
            objectFit="cover"
            fill
            className="rounded-lg mask-b-from-60% mask-b-to-100%"
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
      {titles.length > 0 && (
        <Container className="w-full relative block sm:hidden">
          <TableOfContents.Root>
            <TableOfContents.Button
              className="my-2"
              onClick={() => {
                setContentsOpen(!contentsOpen);
              }}
            />
            <TableOfContents.Popover className="my-2 mx-4">
              <Contents titles={titles} />
            </TableOfContents.Popover>
          </TableOfContents.Root>
        </Container>
      )}

      <Container className="sm:flex gap-10">
        <div className={cn(showPanel && "basis-2/3", "flex flex-col w-full")}>
          <div className="grow box-border pb-12 lg:pb-24">
            <section
              className="box-content"
              data-tina-field={tinaField(data.blogs, "body")}
            >
              <TinaMarkdown
                components={DocAndBlogMarkdownStyle}
                content={data.blogs.body}
              />
            </section>
          </div>
          {(previousBlog || nextBlog) && (
            <div className=" border-t flex border-white/20 pt-6 lg:pt-12">
              {previousBlog && (
                <Link
                  href={`/blog/${previousBlog.slug}`}
                  className="flex items-center text-white/60 transition-colors hover:text-white"
                >
                  <FaArrowLeft className="mr-2 h-4 w-4" />
                  Previous Article
                </Link>
              )}
              {nextBlog && (
                <Link
                  href={nextBlog.slug ? `/blog/${nextBlog.slug}` : "#"}
                  className="flex ml-auto items-center text-white/60 transition-colors hover:text-white"
                >
                  Next Article
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {showPanel && (
          <div className="basis-1/3 shrink-0">
            <div
              className={cn(
                "sticky flex flex-col pt-6 sm:pt-0 summary overflow-hidden top-32 space-y-6",
                titles.length && "sm:h-[calc(100vh_-_11rem)]"
              )}
            >
              {data.blogs.summaryCard && (
                <div className="rounded-lg bg-gray-darkest [scrollbar-width:thin] [scrollbar-color:var(--color-ssw-charcoal)_transparent]  p-6 overflow-y-auto">
                  <div
                    data-tina-field={tinaField(data.blogs, "summary")}
                    className="[&_p]:text-white/60  [&_li]:text-white/60 [&_p] space-y-1.5 [&_li]:text-sm [&_li]:list-disc [&_p]:text-sm text-base [&_a]:text-sm [&_a]:text-ssw-red [&_a]:hover:underline"
                  >
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

              {titles.length > 0 && (
                <div className="hidden sm:block  rounded-lg border shrink-0 border-white/20 [background-image:var(--gradient-black)] p-6">
                  <h3 className="mb-1 font-medium text-white">
                    Table of Contents
                  </h3>
                  <Contents titles={titles} />
                </div>
              )}
            </div>
          </div>
        )}
      </Container>

      <Container className="w-full">
        <hr className=" text-white/20 w-full lg:my-12 my-6" />
      </Container>
      {recentBlogs && recentBlogs.length > 0 && (
        <Container>
          {" "}
          <h2 className="text-2xl font-bold mb-8 text-white border-ssw-red pl-4 border-l-4">
            Recent Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recentBlogs.map((article, index) => {
              return (
                <BlogCard
                  readLength={article.readLength}
                  slug={article.slug}
                  groupHover
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
        </Container>
      )}
    </div>
  );
}

const Contents = ({ titles }: { titles: Title[] }) => {
  return (
    <nav>
      <ul className="text-sm">
        {titles.map((title, index) => (
          <li
            className="text-white/60 group py-1 border-l w-fit pl-2 hover:border-white border-white/10"
            key={index}
            style={{}}
          >
            <a
              onClick={() => {
                const SCROLL_OFFSET = document
                  .querySelectorAll("nav")[0]
                  .getClientRects()[0].height;
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
                  (heading as HTMLElement).getBoundingClientRect().top +
                  window.scrollY;
                window.scrollTo({
                  top: y - SCROLL_OFFSET,
                  behavior: "smooth",
                });
              }}
              href={`#${title.text}`}
              className="inset-0 group-hover:text-ssw-red"
            >
              {title.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
