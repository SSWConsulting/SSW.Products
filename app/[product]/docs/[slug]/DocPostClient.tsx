"use client";
import * as SearchBox from "@comps/search/SearchBox";
import { TableOfContents } from "@comps/TableOfContents";
import { Docs, DocsTableOfContents } from "@tina/__generated__/types";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import TableOfContentsClient from "./TableOfContentsClient";

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
        <SearchBox.Trigger className="w-full" />
        <TableOfContents.Root>
          <TableOfContents.Button />
          <TableOfContents.Popover>
            <TableOfContentsClient tableOfContentsData={tableOfContentsData} />
          </TableOfContents.Popover>
        </TableOfContents.Root>
      </div>
      <BreadCrumbs title={title} />
      <h2 className="text-3xl mb-8 font-semibold text-ssw-red">
        {title}
      </h2>
      <div className="text-base font-light mb-12 lg:prose-xl">
        {body && (
          <TinaMarkdown content={body} components={DocAndBlogMarkdownStyle} />
        )}
      </div>
      <div className="text-sm font-light text-gray-300 uppercase mb-4 mt-12">
        <div>
          <span>Last updated: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
