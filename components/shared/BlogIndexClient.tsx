/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getBlogsForProduct } from "../../utils/fetchBlogs"; // Updated import
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";

const BlogCard = ({
  title,
  author,
  date,
  body,
  readLength,
  blogPostLink,
}: {
  title: string;
  author: string;
  date: string;
  body: TinaMarkdownContent;
  readLength: string;
  blogPostLink: string;
}) => {
  const blurb = extractBlurbAsTinaMarkdownContent(body, 3); // extract 3 sentences in blurb.

  return (
    <Link href={`/blog/${blogPostLink}`}>
      <div className="p-6 rounded-2xl shadow-2xl bg-stone-700/30 mb-6 text-white border-opacity-15 border-2 hover:border-opacity-85 border-slate-300">
        <h2 className="text-2xl mb-2">{title}</h2>
        <div className="font-light text-base">
          <span>by {author} </span>
          <div>
            <span className="text-sm text-gray-300 uppercase">{`${new Date(date).getDate()} ${new Date(date).toLocaleString(
              "default",
              { month: "long" }
            )} ${new Date(date).getFullYear()}`}</span>
            <span>{` | ${readLength}`}</span>
          </div>
          <div className="mt-4">
            <TinaMarkdown content={blurb} />
          </div>
          <div className="mt-4 flex items-center font-light">
            <span>READ MORE</span>
            <HiOutlineArrowNarrowRight className="ml-2 transform scale-x-150 scale-y-125" />
          </div>
        </div>
      </div>
    </Link>
  );
};

interface BlogIndexClientProps {
  query: any;
  data: any;
  product: string;
}

export default function BlogIndexClient({
  data,
  product,
}: BlogIndexClientProps) {
  const [blogs, setBlogs] = useState(data);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreBlogs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const moreBlogs = await getBlogsForProduct(product, offset, 5);

    if (moreBlogs) {
      setBlogs((prevBlogs: any) => {
        const updatedBlogs = [...prevBlogs, ...moreBlogs.data];
        return updatedBlogs;
      });
      setOffset(offset + 5);
      setHasMore(moreBlogs.hasMore);
    }

    setLoading(false);
  }, [offset, hasMore, loading, product]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreBlogs();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#load-more-trigger");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMoreBlogs]);

  return (
    <div className="p-4 lg:pt-32 md:pt-32 mx-auto w-full">
      <h1 className="text-white font-semibold mb-6 text-3xl md:mx-20 lg:mx-40">
        Blogs for {product}
      </h1>
      <div className="mx-4 md:mx-20 lg:mx-40">
        {blogs?.map((blog: any, index: number) => (
          <BlogCard
            key={index}
            title={blog.title}
            author={blog.author}
            date={blog.date}
            body={blog.body}
            readLength={blog.readLength}
            blogPostLink={blog._sys.filename}
          />
        ))}
      </div>
      {hasMore && <div id="load-more-trigger" className="h-20"></div>}
    </div>
  );
}
