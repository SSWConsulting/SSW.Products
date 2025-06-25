"use client";
import * as SearchBox from "@comps/search/SearchBox";
import { TableOfContents } from "@comps/TableOfContents";
import { Docs, DocsTableOfContents } from "@tina/__generated__/types";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import Link from "next/link";
import { ReactNode } from "react";
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
      <h2 className="text-3xl bg-linear-to-br mb-2 linear tracking-wide from-red-400 to-red-700 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="text-base font-light lg:prose-xl">
        <TinaMarkdown
          content={body ?? { type: "root", children: [] }}
          components={{
            ...DocAndBlogMarkdownStyle,
            a: (
              props:
                | { children: ReactNode | undefined; url: string }
                | undefined
            ) => (
              <a
                className="underline transition-colors hover:text-white text-[#CC4141]"
                href={props?.url}
              >
                {props?.children}
              </a>
            ),
          }}
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
