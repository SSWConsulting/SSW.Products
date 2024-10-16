"use client";

import { useEffect, useState } from "react";
import { NavigationBarQuery } from "../../tina/__generated__/types";
import Image from "next/image";
import { BookingButton } from "./Blocks/BookingButton";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavBarClientProps {
  results: NavigationBarQuery | null;
}

export default function NavBarClient({ results }: NavBarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
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
            <Link href={item.href} className="hover:underline text-xl">
              {item.label}
            </Link>
          </li>
        );
      case "NavigationBarLeftNavItemGroupOfStringItems":
      case "NavigationBarRightNavItemGroupOfStringItems":
        return (
          <li key={index} className="flex items-center group relative">
            <span className="cursor-pointer">{item.label}</span>
            <ul className="absolute top-full left-0 bg-white text-black hidden group-hover:block mt-2 space-y-1 p-2 rounded shadow-lg">
              {item.items?.map((subItem: any, subIndex: number) => (
                <li key={subIndex}>
                  <Link href={subItem.href} className="hover:underline">
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
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
          <li key={index} className="flex items-center py-2">
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
            ? "bg-stone-700 bg-opacity-90 backdrop-blur-md"
            : "bg-transparent"
        } text-gray-300 fixed top-0 left-0 w-full z-50 transition-colors duration-300 flex justify-between items-center h-[70px]`}
      >
        <div className="flex items-center md:justify-between lg:justify-normal  w-full px-4 md:px-20">
          {logo && (
            <Link href="/" className="pb-1 lg:px-3 xl:px-0 md:px-3 px-2">
              <Image src={logo} alt="Logo" width={200} height={200} />
            </Link>
          )}

          <button
            className="md:block lg:hidden ml-auto block text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
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
            scrolled ? "bg-opacity-90 bg-stone-700" : "bg-opacity-60 bg-black"
          } backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden lg:hidden w-full text-white absolute top-full left-0 flex flex-col items-start space-y-2`}
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
