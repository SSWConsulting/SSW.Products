"use client";

import { useEffect, useState } from "react";
import { NavigationBarQuery } from "../../tina/__generated__/types";
import Image from "next/image";
import { BookingButton } from "./Blocks/BookingButton";
import Link from "next/link";
import { HiOutlineBars3 } from "react-icons/hi2";
import { CgClose } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

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
  }, []);

  const { navigationBar } = results || {};
  const leftNavItems = navigationBar?.leftNavItem;
  const rightNavItems = navigationBar?.rightNavItem;
  const logo = navigationBar?.Logo;

  const renderNavItem = (item: any, index: number) => {
    switch (item?.__typename) {
      case "NavigationBarLeftNavItemStringItem":
      case "NavigationBarRightNavItemStringItem":
        return (
          <li
            key={index}
            className="flex items-center lg:px-3 xl:px-0 py-1 px-2"
          >
            <Link href={item.href} className="hover:underline underline-offset-4 decoration-[#CC4141] text-md">
              {item.label.toUpperCase()}
            </Link>
          </li>
        );
      case "NavigationBarLeftNavItemGroupOfStringItems":
      case "NavigationBarRightNavItemGroupOfStringItems":
        return (
          <>
            {/* For lg screens and above - show dropdown */}
            <li key={index} className="hidden lg:flex items-center group relative px-2 lg:px-3">
              <span className="cursor-pointer flex items-center gap-2">{item.label.toUpperCase()} <FaChevronRight className="text-red-500 text-sm group-hover:rotate-90 transition-all duration-300"/></span>
              <div className="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible pt-2 transition-all duration-300">
                <ul className="bg-black text-[#D1D5DB] border border-white/20 mt-0 space-y-2 p-3 rounded shadow-lg min-w-[150px] z-10">
                  {item.items?.map((subItem: any, subIndex: number) => (
                    <li key={subIndex} className="hover:text-white transition-colors flex items-center gap-1">
                      <Link href={subItem.href} className="block w-full hover:underline underline-offset-4 decoration-[#CC4141] flex items-center gap-1">
                        {subItem.label}
                        {subItem.href && (subItem.href.startsWith('http://') || subItem.href.startsWith('https://')) && (
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
              <li key={`${index}-${subIndex}`} className="lg:hidden flex items-center px-2 py-1">
                <Link href={subItem.href} className="hover:underline underline-offset-4 decoration-[#CC4141] text-md flex items-center gap-1">
                  {subItem.label}
                  {subItem.href && (subItem.href.startsWith('http://') || subItem.href.startsWith('https://')) && (
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
        className={`${
          scrolled
            ? "bg-[#131313] bg-opacity-90 backdrop-blur-md border-b border-white/50"
            : "bg-transparent "
        } text-gray-300 fixed top-0 inset-x-0 w-full z-50 transition-colors duration-300 flex justify-between place-items-end h-[100px] pb-6 `}
      >
        <div className="flex items-end md:justify-between lg:justify-normal  w-full px-4 md:px-20">
          {logo && (
            <Link href="/" className=" lg:px-3 xl:px-0 md:px-3 px-2">
              <Image src={logo} alt="Logo" width={200} height={200} />
            </Link>
          )}

          <button
            className="md:block lg:hidden ml-auto block text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <CgClose /> : <HiOutlineBars3 />}
          </button>

          <ul className="hidden lg:flex items-center lg:px-10 space-x-15 xl:space-x-10">
            {leftNavItems?.map((item, index) => renderNavItem(item, index))}
          </ul>

          <ul className="hidden lg:flex items-center lg:ml-auto space-x-15 xl:space-x-20">
            {rightNavItems?.map((item, index) => renderNavItem(item, index))}
          </ul>
        </div>
        <div
          className={`${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } ${
            scrolled ? "bg-stone-700 bg-opacity-100" : "bg-opacity-90 bg-black"
          } transition-all duration-500 ease-in-out overflow-hidden lg:hidden w-full text-white absolute top-full left-0 flex flex-col items-start space-y-2`}
        >
          <div className="p-5">
            <ul className="flex flex-col">
              {leftNavItems?.map((item, index) => renderNavItem(item, index))}
            </ul>
            <ul className="flex flex-col space-y-3">
              {rightNavItems?.map((item, index) => renderNavItem(item, index))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
