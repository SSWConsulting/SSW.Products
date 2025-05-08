"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import type { Hit } from "instantsearch.js";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  Highlight,
  Hits,
  InstantSearch,
  Snippet,
  useSearchBox,
} from "react-instantsearch";
import Input from "../../../../components/Input";
import {
  DocsTableOfContents,
  type DocsTableOfContentsParentNavigationGroup as NavigationGroup,
} from "../../../../tina/__generated__/types";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""
);
interface TableOfContentsClientProps {
  tableOfContentsData: DocsTableOfContents;
}
const DocHit = ({
  hit,
}: {
  hit: Hit<{
    title: string;
    body: string;
  }>;
}) => {
  console.log("hit", hit);
  return (
    <div className="border-b-[1px] py-1 px-4 border-gray-lighter/40  ">
      <Highlight
        className="text-ssw-red text-base "
        highlightedTagName={({ children }) => (
          <span className="bg-yellow-400 text-black">{children}</span>
        )}
        attribute="title"
        hit={hit}
      />
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
      <Dialog>
        <OpenSearch />
        <DialogTrigger asChild>
          <Input
            placeholder="Search"
            className="mb-4 shadow-lg mx-4"
            icon={Search}
          />
        </DialogTrigger>
      </Dialog>

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

const OpenSearch = () => {
  return (
    <DialogContent className="box-border ">
      <div className="max-w-3xl box-border relative w-offset-4">
        <div className="h-full box-border z-[70] relative shadow-lg text-lg rounded-3xl text-white  bg-[#1F1F1F] border-2 border-gray-lighter/40">
          <InstantSearch
            stalledSearchDelay={500}
            searchClient={searchClient}
            indexName="docs_index"
          >
            <div className="border-gray-lighter/40 px-4 py-2 align-middle items-center gap-5 flex relative w-full border-b-[1px]">
              <Search />
              {/* <CustomSearch /> */}

              <SearchBox />
              {/* <SearchBox
                className="bg-transparent outline-none placeholder-white "
                translations={{ placeholder: "Search..." }}/> */}
              {/* <SearchBox />
              {/* <input
              className="bg-transparent outline-none placeholder-white "
              placeholder="Search..."
              type="text"
            /> */}
            </div>
            <Hits
              className="max-h-96 [&>*]:pb-5 mb-5 [&>*]:pt-5 box-content [scrollbar-color:_theme(colors.gray.neutral)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative"
              hitComponent={DocHit}
            />
          </InstantSearch>

          {/* <p className="text-gray-light pt-2 px-4">No search results...</p> */}
        </div>

        <div className="absolute z-[60] shadow-lg bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 -bottom-4"></div>
      </div>

      {/* <div className="w-full z-0 h-fit relative">
          <div className=" text-white z-20 border-2  relative w-full py-12 bg-gray-dark mx-auto rounded-3xl px-8">
            <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
            nested overlay?
          </div>
        </div> */}
      {/* <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader> */}

      {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
    </DialogContent>
  );
};

const SearchBox = () => {
  const { refine } = useSearchBox();
  return (
    <input
      type="text"
      className="bg-transparent outline-none placeholder-white "
      placeholder="Search..."
      onChange={(e) => {
        refine(e.target.value);
      }}
    />
  );
};
