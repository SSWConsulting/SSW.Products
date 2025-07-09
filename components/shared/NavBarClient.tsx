"use client";
import useIsScrolled from "@comps/hooks/useIsScrolled";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

import {
  NavigationBarLeftNavItemStringItem as NavItem,
  NavigationBarButtons,
} from "../../tina/__generated__/types";

import { cn } from "@/lib/utils";
import { NavGroup } from "@/types/nav-group";
import { Button } from "@comps/ui/button";
import clsx from "clsx";
import React from "react";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import { BookingButton } from "./Blocks/BookingButton";

interface NavBarClientProps {
  buttons: NavigationBarButtons[];
  items: (NavItem | NavGroup)[];

  bannerImage?: {
    imgSrc: string;
    imgHeight: number;
    imgWidth: number;
  };
}

type MenuContextType = { setIsOpen: (open: boolean) => void };

const MenuContext = React.createContext<MenuContextType>({
  setIsOpen: () => {},
});

const useMenuContext = () => React.useContext(MenuContext);

const MenuContextProvider = MenuContext.Provider;

export default function NavBarClient({
  buttons,
  items,
  bannerImage,
}: NavBarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { scrolled } = useIsScrolled();

  return (
    <MenuContextProvider value={{ setIsOpen }}>
      <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <Popover.Anchor className="w-full" asChild>
          <NavigationMenu.Root
            className={clsx(
              `text-white sticky transition-colors justify-center z-10  duration-300 ease-in-out`,
              scrolled
                ? `shadow-xs bg-[#131313]/80 my-2 py-4 animate-slide animate-in slide-in-from-top-3 backdrop-blur-sm animate-slide-in top-0 `
                : "py-6",
              `z-40 w-full`
            )}
          >
            <NavigationMenu.List className="sm:flex gap-x-5 sm:gap-y-0 gap-y-4  sm:gap-x-0 grid-cols-2 grid mx-4 xl:mx-auto max-w-7xl m-0 justify-center">
              <NavigationMenu.Item className="gap-8  mx-auto flex items-center w-full">
                {bannerImage && (
                  <Link className="mb-2 shrink-0" href="/">
                    <Image
                      src={bannerImage.imgSrc as string}
                      className="h-8 w-auto"
                      width={bannerImage.imgWidth}
                      height={bannerImage.imgHeight}
                      alt="Logo"
                    />
                  </Link>
                )}
              </NavigationMenu.Item>

              {items.map((item, index) => {
                if (
                  item.__typename ===
                    "NavigationBarLeftNavItemGroupOfStringItems" &&
                  item.items &&
                  item.items.length > 0
                ) {
                  return (
                    <NavigationMenu.Item
                      className="my-auto hidden xl:block"
                      key={index}
                    >
                      <NavigationMenu.Trigger className="outline-none text-base h-fit flex items-center w-full gap-2 px-3  rounded  transition-colors">
                        {item.label}
                        <FaChevronRight className="text-red-500 text-sm rotate-90 transition-all duration-300" />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="border mt-2 slide-in-from-top-0 rounded text-[#d1d5db] hover:text-white  border-white/20 shadow-lg p-3 space-y-2 bg-gray-light absolute data-[motion=open]:animation-duration-100 data-[state=open]:animate-in  data-[state=closed]:animate-out data-[state=closed]:animation-duration-300 data-[state=open]:fade-in data-[state=closed]:fade-out">
                        {item.items.map((subItem, subIndex) => (
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
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  );
                } else if (
                  item.__typename === "NavigationBarLeftNavItemStringItem" &&
                  item.href &&
                  item.label
                ) {
                  return (
                    <NavigationMenu.Item
                      className="my-auto hidden xl:block"
                      key={index}
                    >
                      <Link
                        href={item.href}
                        className="px-3 hover:decoration-ssw-red decoration-transparent underline-offset-3 underline text-base block h-fit rounded transition-colors uppercase"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenu.Item>
                  );
                }
                return null;
              })}
              {/* Desktop Buttons */}
              {buttons.map((button, index) => {
                return (
                  <NavigationMenu.Item
                    className={`hidden sm:block ${
                      index === buttons.length - 1 ? "pl-5" : "pl-12"
                    }`}
                    key={index}
                  >
                    <ButtonMap item={button} />
                  </NavigationMenu.Item>
                );
              })}

              <NavigationMenu.Item className="flex xl:hidden justify-end pl-5">
                <Popover.Trigger asChild>
                  <button className="text-3xl my-auto flex align-middle">
                    {isOpen ? <CgClose /> : <HiOutlineBars3 />}
                  </button>
                </Popover.Trigger>
                <Popover.Content
                  asChild
                  className={clsx(
                    scrolled
                      ? "bg-stone-700 "
                      : "bg-opacity-90 bg-gray-light/90",
                    "min-w-screen duration-300 overflow-hidden z-50 py-5 px-7 xl:hidden data-[state=open]:animate-expand text-white transition  data-[state=closed]:animate-collapse top-full flex flex-col items-start space-y-2"
                  )}
                >
                  <ul>
                    <>
                      {items.map((item, index) => {
                        if (!item) return <></>;

                        if (
                          item.__typename ===
                          "NavigationBarLeftNavItemGroupOfStringItems"
                        ) {
                          if (!item.items) return <></>;

                          return (
                            <MobileSubmenu
                              label=""
                              key={index}
                              items={item.items}
                            />
                          );
                        }

                        if (
                          item.__typename ===
                          "NavigationBarLeftNavItemStringItem"
                        ) {
                          return (
                            <MobileMenuItem
                              label={item.label}
                              href={item.href}
                              key={index}
                            />
                          );
                        }
                      })}
                    </>
                  </ul>
                </Popover.Content>
              </NavigationMenu.Item>

              {/* Mobile Buttons */}

              {buttons.map((button, index) => {
                return (
                  <NavigationMenu.Item
                    className="w-full col-span-1 block sm:hidden [&>button]:w-full"
                    key={index}
                  >
                    <ButtonMap className="w-full" item={button} />
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </Popover.Anchor>
      </Popover.Root>
    </MenuContextProvider>
  );
}

type SubMenuProps = {
  label: string;
  items: { href: string; label: string }[];
};

const MobileSubmenu = ({ items }: SubMenuProps) => {
  return (
    <>
      {items.map((subItem, subIndex) => (
        <MobileMenuItem key={subIndex} {...subItem} />
      ))}
    </>
  );
};

const MobileMenuItem = ({ href, label }: { href: string; label: string }) => {
  const { setIsOpen } = useMenuContext();
  return (
    <li className="flex items-center py-1 mb-0">
      <Link
        onClick={() => setIsOpen(false)}
        href={href}
        className="underline decoration-transparent transition-colors uppercase mb-0 underline-offset-4 hover:decoration-[#CC4141] text-md flex items-center gap-1"
      >
        {label}
        {href &&
          (href.startsWith("http://") || href.startsWith("https://")) && (
            <FaExternalLinkAlt className="text-xs text-red-500 opacity-50" />
          )}
      </Link>
    </li>
  );
};

const ButtonMap = ({
  item,
  className,
}: {
  item: NavigationBarButtons;
  className?: string;
}) => {
  switch (item?.__typename) {
    case "NavigationBarButtonsBookingButton":
      if (!item.Title || !item.JotFormId) return null;
      return (
        <BookingButton
          className={className}
          title={item.Title}
          jotFormId={item.JotFormId}
        />
      );
    case "NavigationBarButtonsButtonLink":
      return (
        <Button
          asChild
          className={cn(
            "flex gap-1",
            item.iconPosition === "left" ? "flex-row-reverse" : "flex-row",
            className
          )}
          href={item.href}
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
