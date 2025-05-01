"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineBars3 } from "react-icons/hi2";
import { NavigationBarQuery } from "../../tina/__generated__/types";
import { BookingButton } from "./Blocks/BookingButton";

interface NavBarClientProps {
  results: NavigationBarQuery | null;
}

export default function NavBarClient({ results }: NavBarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const { navigationBar } = results || {};
  const leftNavItems = navigationBar?.leftNavItem;
  const rightNavItems = navigationBar?.rightNavItem;
  const logo = navigationBar?.Logo;

  const renderNavItem = (item: any, index: number) => {
    switch (item?.__typename) {
      case "NavigationBarLeftNavItemStringItem":
      case "NavigationBarRightNavItemStringItem":
        return (
          <li key={index} className="flex items-center py-1">
            <Link
              href={item.href}
              className="hover:underline underline-offset-4 decoration-[#CC4141] text-md"
            >
              {item.label.toUpperCase()}
            </Link>
          </li>
        );
      case "NavigationBarLeftNavItemGroupOfStringItems":
      case "NavigationBarRightNavItemGroupOfStringItems":
        return (
          <>
            {/* For lg screens and above - show dropdown */}
            <li
              key={index}
              className="hidden lg:flex items-center group relative"
            >
              <span className="cursor-pointer flex items-center gap-2">
                {item.label.toUpperCase()}{" "}
                <FaChevronRight className="text-red-500 text-sm rotate-90 transition-all duration-300" />
              </span>
              <div className="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible pt-2 transition-all duration-300">
                <ul className="bg-[#222222] text-[#D1D5DB] border border-white/20 mt-0 space-y-2 p-3 rounded shadow-lg min-w-[150px] z-10">
                  {item.items?.map((subItem: any, subIndex: number) => (
                    <li
                      key={subIndex}
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Link
                        href={subItem.href}
                        className="block w-full hover:underline underline-offset-4 decoration-[#CC4141] flex items-center gap-1"
                      >
                        {subItem.label}
                        {subItem.href &&
                          (subItem.href.startsWith("http://") ||
                            subItem.href.startsWith("https://")) && (
                            <FaExternalLinkAlt className="text-xs text-red-500" />
                          )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* For md screens and below - show all subitems directly */}
            {item.items?.map((subItem: any, subIndex: number) => (
              <li
                key={`${index}-${subIndex}`}
                className="lg:hidden flex items-center py-1"
              >
                <Link
                  href={subItem.href}
                  className="hover:underline underline-offset-4 decoration-[#CC4141] text-md flex items-center gap-1"
                >
                  {subItem.label}
                  {subItem.href &&
                    (subItem.href.startsWith("http://") ||
                      subItem.href.startsWith("https://")) && (
                      <FaExternalLinkAlt className="text-xs text-red-500 opacity-50" />
                    )}
                </Link>
              </li>
            ))}
          </>
        );
      case "NavigationBarLeftNavItemModalButton":
      case "NavigationBarRightNavItemModalButton":
        return (
          <li key={index} className="flex items-center">
            <button
              className={`px-4 py-2 rounded ${
                item.variant === "primary"
                  ? "bg-blue-500 text-white"
                  : item.variant === "secondary"
                  ? "bg-gray-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {item.label}
            </button>
          </li>
        );
      case "NavigationBarRightNavItemBookingButton":
        return (
          <li key={index} className="flex items-center">
            <BookingButton title={item.Title} jotFormId={item.JotFormId} />
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <nav
        className={`text-white transition-colors px-4  duration-300 ease-in-out ${
          scrolled
            ? `fixed shadow-sm bg-[#131313] py-4 bg-opacity-80 backdrop-blur animate-slide-in top-0 `
            : `absolute py-6  `
        } z-40 w-full`}
      >
        <div className="max-w-7xl w-full mx-auto flex justify-between">
          <div className="gap-8 mx-auto flex flex-wrap items-center w-full">
            {logo && (
              <Link href="/" className="flex-shrink-0 mb-1.5">
                <Image src={logo} alt="Logo" width={200} height={200} />
              </Link>
            )}

            <ul className="hidden lg:flex items-center gap-5 flex-grow">
              {leftNavItems?.map((item, index) => renderNavItem(item, index))}
            </ul>
          </div>
          <ul className="sm:flex [&>:not(:last-child)]:hidden sm:[&>:not(:last-child)]:block items-center space-x-5">
            {rightNavItems?.map((item, index) => renderNavItem(item, index))}
            <li className="block lg:hidden">
              <button
                className="text-3xl fled align-middle"
                onClick={(e) => {
                  const handleClickOutside = () => {
                    setIsOpen(false);
                    window.removeEventListener("click", handleClickOutside);
                  };
                  if (isOpen) {
                    return;
                  }
                  setIsOpen(true);
                  window.addEventListener("click", handleClickOutside);
                  e.stopPropagation();
                }}
              >
                {isOpen ? <CgClose /> : <HiOutlineBars3 />}
              </button>
            </li>
          </ul>
          <div
            className={`${
              isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            } ${
              scrolled
                ? "bg-stone-700 bg-opacity-100"
                : "bg-opacity-90 bg-[#222222]"
            } transition-all duration-500 ease-in-out overflow-hidden lg:hidden w-full text-white absolute top-full left-0 flex flex-col items-start space-y-2`}
          >
            <div className="p-5 max-w-7xl mx-auto w-full">
              <ul className="flex flex-col pl-2">
                {leftNavItems?.map((item, index) => renderNavItem(item, index))}
              </ul>
            </div>
          </div>
        </div>
        <ul className="flex pt-4 [&>li>*]:w-full [&>li]:w-full justify-center sm:hidden">
          {rightNavItems?.map((item, index) => renderNavItem(item, index))}
        </ul>
      </nav>
    </div>
  );
}
