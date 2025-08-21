"use client";

import Image from "next/image";
import Link from "next/link";
import { useContextualLink } from "@utils/contextualLink";

import {
  NavigationBarLeftNavItemStringItem as NavItem,
  NavigationBarButtons,
} from "../../tina/__generated__/types";

import { cn } from "@/lib/utils";
import { NavGroup } from "@/types/nav-group";
import {
  MobileAnchor,
  MobileMenuContent,
  MobileMenuItem,
  MobileMenuRoot,
  MobileMenuTrigger,
} from "@comps/NavBar/MobileMenu";
import {
  NavigationMenuBadge,
  NavigationMenuItem,
  NavigationMenuRoot,
} from "@comps/NavBar/NavigationMenu";
import { SubGroupContent, SubGroupTrigger } from "@comps/NavBar/SubGroup";
import { Button } from "@comps/ui/button";
import clsx from "clsx";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BookingButton } from "./Blocks/BookingButton";
import LanguageToggle from "./LanguageToggle";

interface NavBarClientProps {
  buttons: NavigationBarButtons[];
  items: (NavItem | NavGroup)[];
  currentLocale: string;

  bannerImage?: {
    imgSrc: string;
    imgHeight: number;
    imgWidth: number;
  };
}

export default function NavBarClient({ buttons, items, currentLocale, bannerImage }: NavBarClientProps) {
  const contextualHref = useContextualLink();
  return (
    <MobileMenuRoot>
      <MobileAnchor asChild>
        <NavigationMenuRoot>
          {bannerImage && <NavigationMenuBadge {...bannerImage} currentLocale={currentLocale} />}
          {items.map((item, index) => {
            if (
              item.__typename === "NavigationBarLeftNavItemGroupOfStringItems"
            ) {
              return (
                <NavigationMenuItem
                  className="my-auto hidden xl:block"
                  key={index}
                >
                  <SubGroupTrigger label={item.label} />
                  <SubGroupContent>
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={contextualHref(subItem!.href)}
                          className="flex items-center gap-1 hover:text-white hover:underline underline-offset-4 decoration-[#CC4141] transition-colors whitespace-nowrap writing-mode-horizontal"
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
                  </SubGroupContent>
                </NavigationMenuItem>
              );
            } else if (
              item.__typename === "NavigationBarLeftNavItemStringItem"
            ) {
              return (
                <NavigationMenuItem
                  className="my-auto hidden xl:block"
                  key={index}
                >
                  <Link
                    href={contextualHref(item.href)}
                    className="px-3 hover:decoration-ssw-red decoration-transparent underline-offset-3 underline text-base block h-fit rounded transition-colors uppercase whitespace-nowrap writing-mode-horizontal"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              );
            }
            return null;
          })}
          {/* Desktop Buttons */}
          {buttons.map((button, index) => {
            return (
              <NavigationMenuItem
                className={`hidden sm:block ${
                  index === buttons.length - 1 ? "pl-5" : "pl-12"
                }`}
                key={index}
              >
                <ButtonMap item={button} contextualHref={contextualHref} />
              </NavigationMenuItem>
            );
          })}
          <NavigationMenuItem className="hidden sm:block pl-5 flex items-center">
            <LanguageToggle currentLocale={currentLocale} />
          </NavigationMenuItem>
          <NavigationMenuItem className="flex xl:hidden justify-end pl-5">
            <MobileMenuTrigger />
            <MobileMenuContent>
              <>
                {items.map((item, index) => {
                  if (
                    item.__typename ===
                    "NavigationBarLeftNavItemGroupOfStringItems"
                  ) {
                    if (!item.items) return <></>;

                    return item.items.map((subItem, subIndex) => {
                      return (
                        <MobileMenuItem
                          key={subIndex}
                          href={contextualHref(subItem.href)}
                          label={subItem.label}
                        />
                      );
                    });
                  }

                  if (
                    item.__typename === "NavigationBarLeftNavItemStringItem"
                  ) {
                    return (
                      <MobileMenuItem
                        label={item.label}
                        href={contextualHref(item.href)}
                        key={index}
                      />
                    );
                  }
                })}
              </>
            </MobileMenuContent>
          </NavigationMenuItem>
          {buttons.map((button, index) => {
            return (
              <NavigationMenuItem
                className={clsx(
                  "w-full col-span-1 block sm:hidden",
                  index === buttons.length - 1 && index % 2 === 0
                    ? "col-span-2"
                    : "col-span-1"
                )}
                key={index}
              >
                <ButtonMap className="w-full" item={button} contextualHref={contextualHref} />
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuRoot>
      </MobileAnchor>
    </MobileMenuRoot>
  );
}

const ButtonMap = ({ item, className, contextualHref }: {
  item: NavigationBarButtons;
  className?: string;
  contextualHref: (href: string) => string;
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
          <Link href={contextualHref(item.href || "")}>
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
