"use client";
import * as SearchBox from "@comps/search/SearchBox";
import { TableOfContents } from "@comps/TableOfContents";
import { Docs, DocsTableOfContents } from "@tina/__generated__/types";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContextualLink } from "@utils/contextualLink";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import TableOfContentsClient from "./TableOfContentsClient";
import Collapsible, { CollapsibleProps } from "@comps/Collapsible";
import GitHubMetadata from "@utils/githubMetadata";
import OutlineBox from "@comps/OutlineBox";
import PaginationLinksClient, { PaginationLinksClientProps } from "./PaginationLinksClient";
import GoogleStructuredDataScript from "@comps/GoogleStructuredDataScript";

interface DocPostClientProps {
  query: string;
  variables: object;
  pageData: { docs: Docs };
  tableOfContentsData: DocsTableOfContents;
  paginationData: PaginationLinksClientProps;
}

// Find the section (navigation group) that contains the current doc, and the
// link to that section (its first item). Falls back to the docs index.
const useDocSection = (tableOfContentsData: DocsTableOfContents) => {
  const params = useParams<{ slug: string }>();
  const contextualHref = useContextualLink();

  const section = tableOfContentsData.parentNavigationGroup?.find((group) =>
    group?.items?.some((item) => item?.slug?._sys?.filename === params.slug)
  );
  const firstItemSlug = section?.items?.[0]?.slug?._sys?.filename;

  return {
    sectionTitle: section?.title ?? null,
    sectionHref:
      section?.title && firstItemSlug
        ? contextualHref(`/docs/${firstItemSlug}`)
        : contextualHref("/docs"),
  };
};

// Desktop breadcrumb: "Section / Page Title".
const BreadCrumbs = ({
  title,
  tableOfContentsData,
}: {
  title: string;
  tableOfContentsData: DocsTableOfContents;
}) => {
  const { sectionTitle, sectionHref } = useDocSection(tableOfContentsData);

  return (
    <div className="font-light text-base flex items-center mb-4 max-w-full">
      <Link className="underline cursor-pointer whitespace-nowrap" href={sectionHref}>
        {sectionTitle ?? "Docs"}
      </Link>
      <span className="mx-2">/</span>
      <span className="truncate">{title}</span>
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
  <GoogleStructuredDataScript jsonString={data.docs.seo?.googleStructuredData} />
    <div className="mx-auto text-white">
      <div className="md:hidden mb-4 -mx-4">
        <TableOfContents.Root>
          <div className="flex items-center gap-2 border-y border-white/10 py-3 px-4">
            <TableOfContents.Button />
            <SearchBox.Trigger className="mb-0 flex-1" />
          </div>
          <TableOfContents.Popover>
            <TableOfContentsClient tableOfContentsData={tableOfContentsData} />
          </TableOfContents.Popover>
        </TableOfContents.Root>
      </div>
      <div className="flex flex-col gap-2 mb-8">
        <BreadCrumbs title={title} tableOfContentsData={tableOfContentsData} />
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
