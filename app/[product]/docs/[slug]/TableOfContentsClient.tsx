"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { algoliasearch } from "algoliasearch";
import type { Hit } from "instantsearch.js";
import { PackageOpen, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  Highlight,
  Hits,
  InstantSearch,
  Snippet,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import Input from "../../../../components/Input";
import {
  DocsTableOfContents,
  type DocsTableOfContentsParentNavigationGroup as NavigationGroup,
} from "../../../../tina/__generated__/types";

interface TableOfContentsClientProps {
  tableOfContentsData: DocsTableOfContents;
}
const DocHit = ({
  hit,
}: {
  hit: Hit<{
    title: string;
    body: string;
    file: string;
  }>;
}) => {
  // console.log("hit", hit);
  return (
    <div className="border-b-[1px] snap-start py-1 px-4 border-gray-lighter/40  ">
      <Link
        className="hover:underline underline-offset-2 text-ssw-red"
        href={`/docs/${hit?.file}`}
      >
        <Highlight
          className="text-lg"
          highlightedTagName={({ children }) => (
            <span className="bg-yellow-400 text-black">{children}</span>
          )}
          attribute="title"
          hit={hit}
        />
      </Link>
      <Snippet
        className="truncate text-sm overflow-hidden block text-[#797979]"
        // highlightedTagName={({ children }) => (
        //   <span className="bg-yellow-400 text-black">{children}</span>
        // )}
        hit={hit}
        attribute="body"
      />
      {/* <Snippet
        attribute="title"
        hit={hit}
        tagName="p"
        className="text-lg font-medium text-white"
      /> */}
    </div>
  );
};

function NavigationGroup({
  navigationGroup,
  activeItem,
}: {
  navigationGroup: NavigationGroup;
  activeItem: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center w-full text-left"
        >
          <h2 className="bg-gradient-to-br text-white font-medium">
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
              return (
                <div className="group" key={index}>
                  <li
                    key={index}
                    className={`text-sm border-l border-white/10 ${
                      activeItem === item?.slug?._sys?.filename
                        ? "border-[#CC4141]"
                        : "border-white/10 group-hover:border-white/80"
                    }`}
                  >
                    <Link
                      href={`/docs/${item?.slug?._sys?.filename}`}
                      className={`block  p-1.5 ml-6   ${
                        activeItem === item?.slug?._sys?.filename
                          ? "text-[#CC4141] font-semibold"
                          : "text-white/60 group-hover:text-white group-hover:border-white"
                      }`}
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

export default function TableOfContentsClient({
  tableOfContentsData,
}: TableOfContentsClientProps) {
  const [activeItem, setActiveItem] = useState<string>("");

  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/docs") {
      setActiveItem("introduction");
    } else {
      setActiveItem(pathname.split("/").pop() || "");
    }
  }, [pathname]);

  return (
    <>
      <Nested className="hidden sm:block" />

      <div className="px-4">
        {tableOfContentsData.parentNavigationGroup &&
          tableOfContentsData.parentNavigationGroup.map(
            (group, index) =>
              group && (
                <NavigationGroup
                  key={index}
                  navigationGroup={group}
                  activeItem={activeItem}
                />
              )
          )}
      </div>
    </>
  );
}

export const Nested = ({ className }: { className?: string }) => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""
  );
  return (
    <InstantSearch
      stalledSearchDelay={500}
      searchClient={searchClient}
      indexName="docs_index"
    >
      <OpenSearch className={className} />
    </InstantSearch>
  );
};
const OpenSearch = ({ className }: { className?: string }) => {
  const { results } = useInstantSearch();

  return (
    <Dialog>
      <DialogContent className="box-border ">
        <div className="max-w-3xl box-border relative w-offset-4">
          <div className="h-full box-border pb-8 z-[70] relative shadow-lg text-lg rounded-3xl text-white  bg-[#1F1F1F] border-2 border-gray-lighter/40">
            <div className="border-gray-lighter/40 px-4 py-2 align-middle items-center gap-5 flex relative w-full border-b-[1px]">
              <Search />
              <SearchBox className="w-full" />
            </div>
            {results.nbHits === 0 && !results.__isArtificial ? (
              <p className="text-gray-light max-w-full truncate text-nowrap wrap gap-2 flex pt-2 px-4">
                <PackageOpen />
                No results...
              </p>
            ) : (
              <Hits
                className="max-h-96 [&>*]:pb-5 snap-mandatory snap-y  box-content [scrollbar-color:_theme(colors.gray.neutral)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative"
                hitComponent={DocHit}
              />
            )}
          </div>

          <div className="absolute z-[60] shadow-lg bg-gray-dark/75  inset-y-4 rounded-3xl inset-x-8 -bottom-4"></div>
        </div>
      </DialogContent>
      <DialogTrigger asChild>
        <Input
          placeholder="Search..."
          className={cn("mb-4 shadow-lg mx-4", className)}
          icon={Search}
        />
      </DialogTrigger>
    </Dialog>
  );
};

type SearchBoxProps = {
  className?: string;
};
const SearchBox = ({ className }: SearchBoxProps) => {
  const { refine } = useSearchBox();
  return (
    <input
      type="text"
      className={cn(
        className,
        "bg-transparent outline-none placeholder-white "
      )}
      placeholder="Search..."
      onChange={(e) => {
        refine(e.target.value);
      }}
    />
  );
};
