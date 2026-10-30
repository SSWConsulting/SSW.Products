"use client";

import { cn } from "@/lib/utils";
import * as SearchBox from "@comps/search/SearchBox";
import Link from "next/link";
import { useState } from "react";
import { useContextualLink } from "@utils/contextualLink";
import { docSlugFromBreadcrumbs } from "@utils/docPath";
import { FaChevronDown } from "react-icons/fa";
import ExternalLinkIcon from "@comps/NavBar/ExternalLinkIcon";

import {
  DocsTableOfContents,
  type DocsTableOfContentsParentNavigationGroup as NavigationGroup,
} from "@tina/__generated__/types";
import { useParams } from "next/navigation";

interface TableOfContentsClientProps {
  tableOfContentsData: DocsTableOfContents;
}

function NavigationGroup({ navigationGroup, activeItem }: {
  navigationGroup: NavigationGroup;
  activeItem: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const contextualHref = useContextualLink();

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center w-full text-left"
        >
          {/* a nav group label, not a document heading */}
          <span className="bg-linear-to-br text-white font-medium">
            {navigationGroup.title}
          </span>
          <FaChevronDown
            className={`ml-2 transition-transform duration-300 ease-in-out ${
              isExpanded ? "" : "transform -rotate-90"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="pt-1">
            {navigationGroup?.items?.map((item, index) => {
              const itemSlug = docSlugFromBreadcrumbs(item?.slug?._sys?.breadcrumbs);
              const isActive = activeItem === itemSlug;
              return (
                <div className="group" key={itemSlug}>
                  <li
                    key={`navigation-item-${index}`}
                    className={cn(
                      `text-sm box-content relative  border-transparent`
                    )}
                  >
                    <div
                      className={cn(
                        "absolute group-hover:h-full z-2 inset-x-0 box-content  border-l  duration-300 w-1 top-1/2 -translate-y-1/2 transition-all",
                        isActive ? "h-full border-ssw-red" : "h-0 border-white"
                      )}
                    ></div>
                    <div className="absolute h-full w-1 inset-x-0 border-l z-1 box-content border-white/20"></div>
                    <Link
                      href={contextualHref(`/docs/${itemSlug}`)}
                      className={cn(
                        `block transition-colors p-1.5 ml-6 `,
                        isActive
                          ? "text-ssw-red"
                          : "text-white/60 group-hover:text-white"
                      )}
                    >
                      <span className="inline-block">{item?.title}</span>
                    </Link>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

const DESIGN_SYSTEM_URL = "https://design.ssw.com.au/";

const RESOURCES_LABELS = {
  en: {
    title: "Resources",
    designSystem: "SSW Design System",
    newTab: "(opens in a new tab)",
  },
  zh: {
    title: "资源",
    designSystem: "SSW 设计系统",
    newTab: "（在新标签页中打开）",
  },
};

// Fixed links shown under every product's docs, so they live here rather than
// in each product's Tina table of contents
function Resources({ locale }: { locale: keyof typeof RESOURCES_LABELS }) {
  const labels = RESOURCES_LABELS[locale];
  return (
    <nav aria-label={labels.title} className="mb-4">
      <span className="text-white font-medium">{labels.title}</span>
      <ul className="pt-1">
        <li className="group text-sm relative">
          <div className="absolute group-hover:h-full z-2 inset-x-0 border-l w-1 top-1/2 -translate-y-1/2 transition-all duration-300 h-0 border-white"></div>
          <div className="absolute h-full w-1 inset-x-0 border-l z-1 border-white/20"></div>
          <a
            href={DESIGN_SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 p-1.5 ml-6 transition-colors text-white/60 group-hover:text-white"
          >
            {labels.designSystem}
            <ExternalLinkIcon href={DESIGN_SYSTEM_URL} className="text-current" />
            <span className="sr-only">{labels.newTab}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function TableOfContentsClient({ tableOfContentsData }: TableOfContentsClientProps) {
  const params = useParams<{ product: string; slug?: string[] }>();
  // Catch-all route: /docs/tenants/create-tenant arrives as ["tenants", "create-tenant"]
  const activeSlug = params.slug?.join("/") ?? "";

  return (
    <>
      <SearchBox.Trigger />

      <nav aria-label="Documentation">
        {tableOfContentsData.parentNavigationGroup &&
          tableOfContentsData.parentNavigationGroup.map(
            (group, index) =>
              group && (
                <NavigationGroup
                  activeItem={
                    activeSlug ||
                    docSlugFromBreadcrumbs(
                      tableOfContentsData?.parentNavigationGroup?.[0]?.items?.[0]
                        ?.slug?._sys?.breadcrumbs
                    )
                  }
                  key={index}
                  navigationGroup={group}
                />
              )
          )}
      </nav>

      {/* Match the sidebar's language: zh products load their own zh/toc.mdx,
          the rest fall back to the English one */}
      <Resources
        locale={
          tableOfContentsData._sys?.breadcrumbs?.[1] === "zh" ? "zh" : "en"
        }
      />
    </>
  );
}

export default TableOfContentsClient;
