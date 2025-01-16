/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"; // Assuming TinaMarkdown is used for rendering markdown content
import { DocAndBlogMarkdownStyle } from "./DocAndBlogMarkdownStyle";

interface BlogPostClientProps {
  title: string;
  author: string;
  date: string;
  body: TinaMarkdownContent;
  sswPeopleLink?: string;
  readLength: string;
  filename: string;
}

const BreadCrumbs = ({ title }: { title: string }) => {
    return (
      <div className="font-light mb-8 text-base inline-flex items-top">
        <Link href="/blog">BLOG</Link> 
        <span className="mx-2">
          <MdOutlineKeyboardArrowRight size={20} />
        </span>
        <span>{title.toUpperCase()}</span>
      </div>
    );
  };
export default function BlogPostClient({
  title,
  author,
  date,
  body,
  sswPeopleLink,
  readLength,
  
}: BlogPostClientProps) {

  return (
    <>
      <div className="p-4 lg:pt-32 md:pt-20 mt-20 font-semibold max-w-3xl mx-auto text-white">
        <BreadCrumbs title={title} />
        <h2 className="text-3xl mb-2 tracking-wide">{title}</h2>

        <div className="text-sm font-light text-gray-300 uppercase mb-4">
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
            <span>{`${new Date(date).getDate()} ${new Date(date).toLocaleString(
              "default",
              { month: "long" }
            )} ${new Date(date).getFullYear()}`}</span>
            <span>{` | ${readLength}`}</span>
          </div>
        </div>

        <div className="text-base font-light lg:prose-xl">
          <TinaMarkdown content={body} components={DocAndBlogMarkdownStyle} />
        </div>
      </div>
    </>
  );
}
