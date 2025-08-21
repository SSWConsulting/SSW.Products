"use client";

import { cn } from "@/lib/utils";
import * as SearchBox from "@comps/search/SearchBox";
import Link from "next/link";
import { useState } from "react";
import { useContextualLink } from "@utils/contextualLink";
import { FaChevronDown } from "react-icons/fa";

import {
  DocsTableOfContents,
  type DocsTableOfContentsParentNavigationGroup as NavigationGroup,
} from "@tina/__generated__/types";
import { useParams } from "next/navigation";

interface TableOfContentsClientProps {
  tableOfContentsData: DocsTableOfContents;
  locale: string;
}

function NavigationGroup({ navigationGroup, activeItem, locale }: {
  navigationGroup: NavigationGroup;
  activeItem: string;
  locale: string;
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
          <h2 className="bg-linear-to-br text-white font-medium">
            {navigationGroup.title}
          </h2>
          <FaChevronDown
            className={`ml-2 transition-transform duration-300 ease-in-out ${
              isExpanded ? "" : "transform -rotate-90"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="pt-1">
            {navigationGroup?.items?.map((item, index) => {
              const isActive = activeItem === item?.slug?._sys?.filename;
              return (
                <div className="group" key={item?.slug?._sys?.filename}>
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
                      href={contextualHref(`/docs/${item?.slug?._sys?.filename}`)}
                      className={cn(
                        `block transition-colors p-1.5 ml-6 `,
                        activeItem === item?.slug?._sys?.filename
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

function TableOfContentsClient({ tableOfContentsData, locale }: TableOfContentsClientProps) {
  const params = useParams<{ product: string; slug: string }>();

  return (
    <>
      <SearchBox.Trigger />

      {tableOfContentsData.parentNavigationGroup &&
        tableOfContentsData.parentNavigationGroup.map(
          (group, index) =>
            group && (
              <NavigationGroup
                activeItem={
                  params.slug ||
                  tableOfContentsData?.parentNavigationGroup?.[0]?.items?.[0]
                    ?.slug?._sys?.filename ||
                  ""
                }
                key={index}
                navigationGroup={group}
                locale={locale}
              />
            )
        )}
    </>
  );
}

export default TableOfContentsClient;
