"use client";

import SearchBox from "@comps/search/SearchBox";
import { Docs, DocsTableOfContents } from "@tina/__generated__/types";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdClose, MdMenu, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { TableOfContentsClient } from "./TableOfContentsClient";

interface DocPostClientProps {
  query: string;
  variables: object;
  pageData: { docs: Docs };
  tableOfContentsData: DocsTableOfContents;
}

const BreadCrumbs = ({ title }: { title: string }) => {
  return (
    <div className="font-light mb-8 text-base inline-flex items-top">
      <Link className="underline cursor-pointer" href="/docs">
        DOCS
      </Link>
      <span className="mx-2">
        <MdOutlineKeyboardArrowRight size={20} />
      </span>
      <span>{title.toUpperCase()}</span>
    </div>
  );
};

export default function DocPostClient({
  query,
  variables,
  pageData,
  tableOfContentsData,
}: DocPostClientProps) {
  const { data } = useTina<{ docs: Docs }>({
    query,
    variables,
    data: pageData,
  });

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tocRef.current &&
        buttonRef.current &&
        !tocRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsTableOfContentsOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isTableOfContentsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTableOfContentsOpen]);

  if (!data?.docs) {
    return <p className="text-center text-white">No content available.</p>;
  }

  const { title, date, body } = data.docs;

  // Ensure the date is valid before formatting
  const parsedDate = date ? new Date(date) : null;
  const formattedDate =
    parsedDate && !isNaN(parsedDate.getTime())
      ? `${parsedDate.getDate()} ${parsedDate.toLocaleString("default", {
          month: "long",
        })} ${parsedDate.getFullYear()}`
      : "Unknown Date";

  return (
    <div className="mx-auto text-white">
      <div className="md:hidden flex flex-col justify-center items-center py-4 relative">
        <SearchBox
          className="w-full"
          index={tableOfContentsData.algoliaSearchIndex ?? ""}
        />
        <button
          ref={buttonRef}
          className="flex justify-center items-center gap-2 w-full text-white/60 hover:text-white transition-all duration-300 bg-white/10 p-2 rounded-lg"
          onClick={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
        >
          <MdMenu className="text-[#CC4141]" />
          <span className="font-light">Table of Contents</span>
        </button>
        <div
          ref={tocRef}
          className={`${
            isTableOfContentsOpen ? "block" : "hidden"
          } absolute top-full left-0 right-0 z-30 bg-black/95 rounded-lg border border-white/10 shadow-xl max-h-1/2 overflow-y-auto`}
        >
          <div className="flex justify-between items-center p-3 border-b border-white/10">
            <h2 className="text-lg font-medium text-white">
              Table of Contents
            </h2>
            <button
              onClick={() => setIsTableOfContentsOpen(false)}
              className="text-white/60 hover:text-white p-1"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
          <div className="p-3">
            <TableOfContentsClient tableOfContentsData={tableOfContentsData} />
          </div>
        </div>
      </div>
      <BreadCrumbs title={title} />
      <h2 className="text-3xl mb-2 tracking-wide">{title}</h2>
      <div className="text-base font-light lg:prose-xl">
        <TinaMarkdown
          content={body ?? { type: "root", children: [] }}
          components={DocAndBlogMarkdownStyle}
        />
      </div>
      <div className="text-sm font-light text-gray-300 uppercase mb-4">
        <div>
          <span>Last Updated: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
