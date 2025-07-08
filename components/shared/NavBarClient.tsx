"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

import {
  NavigationBarLeftNavItem as LeftNavItem,
  NavigationBarButtons,
} from "../../tina/__generated__/types";

import { Button } from "@comps/ui/button";
import clsx from "clsx";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import { NavigationBarQuery } from "../../tina/__generated__/types";
import { BookingButton } from "./Blocks/BookingButton";
interface NavBarClientProps {
  results: NavigationBarQuery | null;
}

type NavItem = LeftNavItem | null;

export default function NavBarClient({ results }: NavBarClientProps) {
  const [scrolled, setScrolled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });
  console.log("NavBarClient rendered", results);
  const { navigationBar } = results || {};
  const leftNavItems =
    navigationBar?.leftNavItem?.filter((item) => item !== null) || [];
  const buttons =
    navigationBar?.buttons?.filter((button) => button !== null) || [];
  // const rightNavItems = navigationBar?.rightNavItem;
  const { imgSrc, imgHeight, imgWidth } = navigationBar || {};

  // MenuItem component for single navigation items

  // Helper to render submenu items
  // const renderSubMenuItem = (item: NavItem, index: number) => {
  //   if (
  //     item?.__typename !== "NavigationBarLeftNavItemGroupOfStringItems" &&
  //     item?.__typename !== "NavigationBarRightNavItemGroupOfStringItems"
  //   ) {
  //     return null;
  //   }
  //   const label = (item as any).label;
  //   const items = (item as any).items;
  //   if (!label || !Array.isArray(items)) return null;
  //   const filteredItems = items.filter(
  //     (subItem: any): subItem is { href: string; label: string } =>
  //       !!subItem &&
  //       typeof subItem.href === "string" &&
  //       typeof subItem.label === "string"
  //   );
  //   if (filteredItems.length === 0) return null;
  //   return <SubMenuItem key={index} label={label} items={filteredItems} />;
  // };

  const renderNavItem = (item: NavItem, index: number) => {
    if (!item) return <></>;
    switch (item?.__typename) {
      case "NavigationBarLeftNavItemStringItem":
        return item?.href && item.label ? (
          <MenuItem key={index} href={item.href} label={item.label} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <NavigationMenu.Root
      className={`text-white relative transition-colors justify-center w-screen z-10  duration-300 ease-in-out ${
        scrolled
          ? `shadow-xs bg-[#131313]/80 my-2 py-4 animate-slide animate-in slide-in-from-top-3 backdrop-blur-sm animate-slide-in top-0 `
          : "py-6"
      } z-40 w-full`}
    >
      <NavigationMenu.List className="flex mx-auto max-w-7xl m-0 justify-center">
        <NavigationMenu.Item className="gap-8 mx-auto flex @container items-center w-full">
          {imgWidth && imgHeight && imgSrc && (
            <Link className="mb-2 shrink-0" href="/">
              <Image
                src={imgSrc as string}
                className="h-8 w-auto"
                width={Number(imgWidth)}
                height={Number(imgHeight)}
                alt="Logo"
              />
            </Link>
          )}
        </NavigationMenu.Item>

        {leftNavItems?.map((item, index) => {
          if (
            item.__typename === "NavigationBarLeftNavItemGroupOfStringItems" &&
            item.items &&
            item.items.length > 0
          ) {
            return (
              <NavigationMenu.Item key={index}>
                <NavigationMenu.Trigger className="outline-none  flex items-center gap-2 px-3  rounded hover:bg-white/10 transition-colors">
                  {item.label}
                  <FaChevronRight className="text-red-500 text-sm rotate-90 transition-all duration-300" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="border-0 absolute data-[state=open]:animate-in  data-[state=closed]:animate-out animation-duration-100 data-[state=open]:fade-in data-[state=closed]:fade-out">
                  {/* <ul className="space-y-2"> */}
                  {item.items
                    .filter(
                      (subItem) => subItem && subItem.href && subItem.label
                    )
                    .map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem!.href}
                          className="flex items-center gap-1 hover:text-white hover:underline underline-offset-4 decoration-[#CC4141] transition-colors"
                        >
                          {subItem!.label}
                          {subItem!.href &&
                            (subItem!.href.startsWith("http://") ||
                              subItem!.href.startsWith("https://")) && (
                              <FaExternalLinkAlt className="text-xs text-red-500" />
                            )}
                        </Link>
                      </li>
                    ))}
                  {/* </ul> */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          } else if (
            item.__typename === "NavigationBarLeftNavItemStringItem" &&
            item.href &&
            item.label
          ) {
            return (
              <NavigationMenu.Item key={index}>
                <Link
                  href={item.href}
                  className="px-3 py-2 rounded hover:bg-white/10 transition-colors uppercase"
                >
                  {item.label}
                </Link>
              </NavigationMenu.Item>
            );
          }
          return null;
        })}

        {buttons.map((button, index) => {
          return (
            <NavigationMenu.Item key={index}>
              <ButtonMap item={button} />
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );

  return (
    <nav
      className={`text-white transition-colors sticky duration-300 ease-in-out ${
        scrolled
          ? `shadow-xs bg-[#131313]/80 my-2 py-4 animate-slide animate-in slide-in-from-top-3 backdrop-blur-sm animate-slide-in top-0 `
          : "py-6"
      } z-40 w-full`}
    >
      <div className="max-w-7xl gap-12 mx-4 xl:mx-auto flex justify-between">
        <div className="gap-8 mx-auto flex @container items-center w-full">
          {imgWidth && imgHeight && imgSrc && (
            <Link className="mb-2 shrink-0" href="/">
              <Image
                src={imgSrc as string}
                className="h-8 w-auto"
                width={Number(imgWidth)}
                height={Number(imgHeight)}
                alt="Logo"
              />
            </Link>
          )}

          <ul className="hidden @3xl:flex justify-end items-center gap-6 grow">
            {leftNavItems?.map((item, index) => {
              return item?.__typename ===
                "NavigationBarLeftNavItemGroupOfStringItems" ? (
                item.items && (
                  <SubMenuItem
                    items={item.items.filter(
                      (item) => item !== null && item !== undefined
                    )}
                    label={item.label}
                  />
                )
              ) : (
                <MenuItem key={index} href={item?.href} label={item?.label} />
              );
            })}
          </ul>
        </div>
        <div className="sm:flex hidden gap-5 items-center ">
          {buttons?.map((button, index) => {
            return <ButtonMap item={button} key={index} />;
          })}
          {/* <li className="block xl:hidden"> */}
          <button
            className="text-3xl flex align-middle"
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
          {/* </li> */}
        </div>
        <div
          className={`${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } ${
            scrolled ? "bg-stone-700" : "bg-opacity-90 bg-[#222222]/90"
          } transition-all duration-500 ease-in-out overflow-hidden xl:hidden w-full text-white absolute top-full left-0 flex flex-col items-start space-y-2`}
        >
          <div className="p-5 max-w-7xl mx-auto w-full">
            <ul className="flex flex-col pl-2">
              {leftNavItems?.map((item, index) => {
                return item?.__typename ===
                  "NavigationBarLeftNavItemGroupOfStringItems"
                  ? item.items && (
                      <MobileSubmenu
                        items={item.items?.filter(
                          (item) => item !== undefined && item !== null
                        )}
                        label={item.label}
                      />
                    )
                  : renderNavItem(item, index);
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className=" pt-4 flex flex-col [&>li]:w-full [&>li>*]:w-full mx-4 gap-2 xl:mx-0 justify-center sm:hidden">
        {buttons?.map((button, index) => {
          return <ButtonMap item={button} key={index} />;
        })}
      </div>
    </nav>
  );
}

const MenuItem = ({ href, label }: { href: string; label: string }) => (
  <li className="flex items-center py-1">
    <Link
      href={href}
      className="hover:underline underline-offset-4 decoration-[#CC4141] text-md"
    >
      {label.toUpperCase()}
    </Link>
  </li>
);

type SubMenuProps = {
  label: string;
  items: { href: string; label: string }[];
};
// SubMenuItem component for grouped navigation items
const SubMenuItem = ({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) => (
  <>
    {/* For lg screens and above - show dropdown */}
    <li className="hidden xl:flex items-center group relative">
      <span className="cursor-pointer flex items-center gap-2">
        {label.toUpperCase()}{" "}
        <FaChevronRight className="text-red-500 text-sm rotate-90 transition-all duration-300" />
      </span>
      <div className="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible pt-2 transition-all duration-300">
        <ul className="bg-[#222222] text-[#D1D5DB] border border-white/20 mt-0 space-y-2 p-3 rounded shadow-lg min-w-[150px] z-10">
          {items.map((subItem, subIndex) => (
            <li
              key={subIndex}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Link
                href={subItem.href}
                className="w-full hover:underline underline-offset-4 decoration-[#CC4141] flex items-center gap-1"
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
  </>
);

const MobileSubmenu = ({ items }: SubMenuProps) => {
  return (
    <>
      {items.map((subItem, subIndex) => (
        <li
          key={`mobile-${subIndex}`}
          className="xl:hidden flex items-center py-1"
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
};

const ButtonMap = ({ item }: { item: NavigationBarButtons }) => {
  switch (item?.__typename) {
    case "NavigationBarButtonsBookingButton":
      if (!item.Title || !item.JotFormId) return null;
      return <BookingButton title={item.Title} jotFormId={item.JotFormId} />;
    case "NavigationBarButtonsButtonLink":
      return (
        <Button
          asChild
          className={clsx(
            "flex gap-1",
            item.iconPosition === "left" ? "flex-row-reverse" : "flex-row"
          )}
          href={item.href || undefined}
          variant={
            (item?.variant ? "white" : item.variant) as "outline" | "white"
          }
          key={item.label}
        >
          <Link href={item.href || ""}>
            {item.label}

            {item.icon && (
              <div className="relative size-6">
                <Image
                  fill
                  src={item.icon}
                  alt={item.label || "Icon"}
                  className=" inset-0"
                />
              </div>
            )}
          </Link>
        </Button>
      );
  }
};
