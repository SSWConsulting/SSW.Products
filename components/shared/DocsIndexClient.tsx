/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { extractBlurbAsTinaMarkdownContent } from "../../utils/extractBlurbAsTinaMarkdownContent";
import { getDocsForProduct } from "../../utils/fetchDocs";

const DocsCard = ({
  title,
  date,
  body,
  blogPostLink: docPostLink,
}: {
  title: string;
  date: string;
  body: TinaMarkdownContent;
  blogPostLink: string;
}) => {
  const blurb = extractBlurbAsTinaMarkdownContent(body, 3); // extract 3 sentences in blurb.

  return (
    <Link href={`/docs/${docPostLink}`}>
      <div className="p-6 rounded-2xl shadow-2xl bg-stone-700/30 mb-6 text-white border-opacity-15 border-2 hover:border-opacity-85 border-slate-300">
        <h2 className="text-2xl mb-2">{title}</h2>
        <div className="font-light text-base">
          <div>
            <span className="text-sm text-gray-300 uppercase">{`${new Date(date).getDate()} ${new Date(date).toLocaleString(
              "default",
              { month: "long" }
            )} ${new Date(date).getFullYear()}`}</span>
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

export default function DocsIndexClient({
  data,
  product,
}: BlogIndexClientProps) {
  const [docs, setDocs] = useState(data);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreDocs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const moreDocs = await getDocsForProduct(product, offset, 5);

    if (moreDocs) {
      setDocs((prevBlogs: any) => {
        const updatedBlogs = [...prevBlogs, ...moreDocs.data];
        return updatedBlogs;
      });
      setOffset(offset + 5);
      setHasMore(moreDocs.hasMore);
    }

    setLoading(false);
  }, [offset, hasMore, loading, product]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreDocs();
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
  }, [loadMoreDocs]);

  return (
    <div className="p-4 lg:pt-32 mt-20 md:mt-0 md:pt-32 mx-auto w-full">
      <h1 className="text-white font-semibold mb-6 text-3xl md:mx-20 lg:mx-40">
        Docs for {product}
      </h1>
      <div className="mx-4 md:mx-20 lg:mx-40">
        {docs?.map((blog: any, index: number) => (
          <DocsCard
            key={index}
            title={blog.title}
            date={blog.date}
            body={blog.body}
            blogPostLink={blog._sys.filename}
          />
        ))}
      </div>
      {hasMore && <div id="load-more-trigger" className="h-20"></div>}
    </div>
  );
}
