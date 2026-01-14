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
import Collapsible, { CollapsibleProps } from "@comps/Collapsible";
import GitHubMetadata from "@utils/githubMetadata";
import OutlineBox from "@comps/OutlineBox";
import PaginationLinksClient, { PaginationLinksClientProps } from "./PaginationLinksClient";

interface DocPostClientProps {
  query: string;
  variables: object;
  pageData: { docs: Docs };
  tableOfContentsData: DocsTableOfContents;
  paginationData: PaginationLinksClientProps;
}

const BreadCrumbs = ({ title }: { title: string }) => {
  return (
    <div className="font-light text-base inline-flex items-top mb-4">
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
  paginationData
}: DocPostClientProps) {
  const { data } = useTina<{ docs: Docs }>({
    query,
    variables,
    data: pageData,
  });

  if (!data?.docs) {
    return <p className="text-center text-white">No content available.</p>;
  }

  const { title, body } = data.docs;

  const components = {
    ...DocAndBlogMarkdownStyle,
    OutlineBox,
    Collapsible: (props: CollapsibleProps) => <Collapsible {...props} />,
  };

  return (
  <>
  {data?.docs?.seo?.googleStructuredData && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  data?.docs?.seo?.googleStructuredData ?? {}
                ),
              }}
            />
  )}
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
      <div className="flex flex-col gap-2 mb-8">
        <BreadCrumbs title={title} />
        <h2 className="text-3xl font-semibold text-ssw-red">{title}</h2>
        <GitHubMetadata path={data.docs.id} className="text-sm font-light text-gray-300" />
      </div>
      <div className="text-base font-light mb-12 lg:prose-xl">
        {body && (
          <TinaMarkdown content={body} components={components} />
        )}
      </div>
    </div>

      <PaginationLinksClient
        prev={paginationData.prev}
        next={paginationData.next}
      />
    </>
  );
}
