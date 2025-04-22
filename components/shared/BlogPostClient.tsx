"use client";

import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { DocAndBlogMarkdownStyle } from "../../tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { useTina } from "tinacms/dist/react";
import { Blogs } from "../../tina/__generated__/types";

interface BlogPostClientProps {
  query: string;
  variables: object;
  pageData: { blogs: Blogs };
}

const BreadCrumbs = ({ title }: { title: string }) => {
  return (
    <div className="font-light mb-12 text-base inline-flex items-top">
      <Link className="underline cursor-pointer" href="/blog">
        BLOG
      </Link>
      <span className="mx-2">
        <MdOutlineKeyboardArrowRight size={20} />
      </span>
      <span>{title.toUpperCase()}</span>
    </div>
  );
};

export default function BlogPostClient({
  query,
  variables,
  pageData,
}: BlogPostClientProps) {
  const { data } = useTina<{ blogs: Blogs }>({
    query,
    variables,
    data: pageData,
  });

  if (!data?.blogs) {
    return <p className="text-center text-white">No content available.</p>;
  }

  const { title, date, sswPeopleLink, readLength, author, body } = data.blogs;

  const parsedDate = date ? new Date(date) : null;
  const formattedDate =
    parsedDate && !isNaN(parsedDate.getTime())
      ? `${parsedDate.getDate()} ${parsedDate.toLocaleString("default", {
          month: "long",
        })} ${parsedDate.getFullYear()}`
      : "Unknown Date";

  return (
    <div className="p-4 lg:pt-32 md:pt-20 mt-4 mb-20 max-w-4xl mx-auto text-white">
      <BreadCrumbs title={title} />
      <h2 className="text-3xl mb-2 font-semibold tracking-wide">{title}</h2>

      <div className="text-sm font-light text-gray-300 uppercase mb-6">
        <span>
          by{" "}
          {sswPeopleLink ? (
            <Link target="_blank" href={sswPeopleLink} className="underline">
              {author}
            </Link>
          ) : (
            <span>{author}</span>
          )}
        </span>

        <div>
          <span>{formattedDate}</span>
          <span>{` | ${readLength}`}</span>
        </div>
      </div>

      <div className="text-base font-light lg:prose-xl">
        <TinaMarkdown
          content={body ?? { type: "root", children: [] }}
          components={DocAndBlogMarkdownStyle}
        />
      </div>
    </div>
  );
}
