"use client";

import { DocsTableOfContents } from "../../../../tina/__generated__/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface TableOfContentsClientProps {
  tableOfContentsData: DocsTableOfContents;
}

function NavigationGroup({
  navigationGroup,
  activeItem,
}: {
  navigationGroup: any;
  activeItem: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  console.log(activeItem);
  return (
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
        {navigationGroup.items && (
          <ul className="ml-6 mt-2 ">
            {navigationGroup.items.map((item: any, index: number) => {
              return (
                <li key={index} className="text-sm">
                  <Link
                    href={`/docs/${item.slug?._sys?.filename || "#"}`}
                    className={`block hover:bg-white/10 p-1.5 rounded-md transition-all duration-300 ${
                      activeItem === item.slug?._sys?.filename
                        ? "text-[#CC4141] font-semibold"
                        : "text-white/60"
                    }`}
                  >
                    <span className="inline-block">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function TableOfContentsClient({
  tableOfContentsData,
}: TableOfContentsClientProps) {
  const [activeItem, setActiveItem] = useState<string>("");

  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/docs") {
      setActiveItem("how-to-use-yakshaver");
    } else {
      setActiveItem(pathname.split("/").pop() || "");
    }
  }, [pathname]);

  return (
    <div className="px-4">
      {tableOfContentsData.parentNavigationGroup &&
        tableOfContentsData.parentNavigationGroup.map((group, index) => (
          <NavigationGroup
            key={index}
            navigationGroup={group}
            activeItem={activeItem}
          />
        ))}
    </div>
  );
}
