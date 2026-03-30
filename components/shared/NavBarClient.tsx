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
  useMenuContext,
} from "@comps/NavBar/MobileMenu";
import {
  NavigationMenuBadge,
  NavigationMenuItem,
  NavigationMenuRoot,
} from "@comps/NavBar/NavigationMenu";
import { SubGroupContent, SubGroupTrigger } from "@comps/NavBar/SubGroup";
import { Button } from "@comps/ui/button";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BookingButton, variantMap } from "./Blocks/BookingButton";
import LanguageToggle from "./LanguageToggle";
import GrowingLink from "@comps/GrowingLink";
import { ButtonVariant } from "./Blocks/buttonEnum";

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

export default function NavBarClient({
  buttons,
  items,
  currentLocale,
  bannerImage,
}: NavBarClientProps) {
  const contextualHref = useContextualLink();
  return (
    <MobileMenuRoot>
      <NavBarClientContent
        buttons={buttons}
        items={items}
        currentLocale={currentLocale}
        bannerImage={bannerImage}
        contextualHref={contextualHref}
      />
    </MobileMenuRoot>
  );
}

function NavBarClientContent({
  buttons,
  items,
  currentLocale,
  bannerImage,
  contextualHref,
}: NavBarClientProps & { contextualHref: (href: string) => string }) {
  const { isOpen } = useMenuContext();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const pathname = usePathname();

  // Collect all group sub-item hrefs so regular items don't falsely activate
  const groupSubHrefs = items
    .filter((i) => i.__typename === "NavigationBarLeftNavItemGroupOfStringItems")
    .flatMap((i) => ("items" in i ? i.items.map((s) => contextualHref(s.href)) : []));

  const isLinkActive = (href: string, excludeGroupOverlap = false) => {
    if (href.startsWith("http") || href.startsWith("#")) return false;
    const resolved = contextualHref(href);
    if (pathname === resolved) return true;
    if (pathname.startsWith(resolved + "/")) {
      return !excludeGroupOverlap ||
        !groupSubHrefs.some((h) => h !== resolved && pathname.startsWith(h));
    }
    return false;
  };

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <MobileAnchor asChild>
      <NavigationMenuRoot ref={headerRef} mobileOpened={isOpen}>
        {bannerImage ? (
          <NavigationMenuBadge {...bannerImage} currentLocale={currentLocale} />
        ) : (
          <NavigationMenuItem className="mx-auto flex items-center w-full">
            <div className="h-8 w-[125px] shrink-0" />
          </NavigationMenuItem>
        )}
        {items.map((item, index) => {
          if (
            item.__typename === "NavigationBarLeftNavItemGroupOfStringItems"
          ) {
            const isGroupActive = item.items.some(
              (subItem) => isLinkActive(subItem.href)
            );
            return (
              <NavigationMenuItem
                className="my-auto hidden xl:block"
                key={index}
              >
                <SubGroupTrigger label={item.label} isActive={isGroupActive} />
                <SubGroupContent>
                  {item.items.map((subItem, subIndex) => {
                    const isSubActive = isLinkActive(subItem.href);
                    return (
                    <li key={subIndex}>
                      <GrowingLink
                        {...(subItem.openInNewTab ? { target: "_blank" } : {})}
                        underlineColor="red"
                        href={contextualHref(subItem.href)}
                        className={cn("flex items-center gap-1 min-h-[36px] min-w-[36px] w-fit hover:text-white underline-offset-4 transition-colors relative whitespace-nowrap writing-mode-horizontal", isSubActive && "after:scale-x-100 after:origin-left text-white")}
                      >
                        {subItem!.label}
                        {subItem!.href &&
                          (subItem!.href.startsWith("http://") ||
                            subItem!.href.startsWith("https://")) && (
                            <FaExternalLinkAlt className="text-xs text-ssw-red" />
                          )}
                      </GrowingLink>
                    </li>
                    );
                  })}
                </SubGroupContent>
              </NavigationMenuItem>
            );
          } else if (item.__typename === "NavigationBarLeftNavItemStringItem") {
            const isActive = isLinkActive(item.href, true);
            return (
              <NavigationMenuItem
                className="my-auto hidden xl:block"
                key={index}
              >
                <GrowingLink
                  href={contextualHref(item.href)}
                  {...(item.openInNewTab ? { target: "_blank" } : {})}
                  className={cn("mx-3 text-base flex flex-row gap-1 items-center min-h-[42px] rounded uppercase whitespace-nowrap writing-mode-horizontal", isActive && "after:scale-x-100 after:origin-left")}
                  underlineColor="red"
                >
                  {item.label}
                  {item.href.startsWith("http://") ||
                    (item.href.startsWith("https://") && (
                      <FaExternalLinkAlt className="text-ssw-red text-xs" />
                    ))}
                </GrowingLink>
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
          <MobileMenuContent headerHeight={headerHeight}>
            <>
              {items.map((item, index) => {
                if (
                  item.__typename ===
                  "NavigationBarLeftNavItemGroupOfStringItems"
                ) {
                  if (!item.items) return <></>;

                  return item.items.map((subItem, subIndex) => {
                    const isSubActive = isLinkActive(subItem.href);
                    return (
                      <MobileMenuItem
                        openInNewTab={Boolean(subItem.openInNewTab)}
                        key={subIndex}
                        href={contextualHref(subItem.href)}
                        label={subItem.label}
                        isActive={isSubActive}
                      />
                    );
                  });
                }

                if (item.__typename === "NavigationBarLeftNavItemStringItem") {
                  const isActive = isLinkActive(item.href, true);
                  return (
                    <MobileMenuItem
                      label={item.label}
                      openInNewTab={Boolean(item.openInNewTab)}
                      href={contextualHref(item.href)}
                      isActive={isActive}
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
              <ButtonMap
                className="w-full"
                item={button}
                contextualHref={contextualHref}
              />
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuRoot>
    </MobileAnchor>
  );
}

const ButtonMap = ({
  item,
  className,
  contextualHref,
}: {
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
    case "NavigationBarButtonsActions": {
      const shadcnVariant =
        variantMap[item.variant as ButtonVariant] ??
        variantMap[ButtonVariant.SolidWhite];
      return (
        <Button
          asChild
          className={cn(
            "flex gap-1 min-h-[42px]",
            item.iconPosition === "left" ? "flex-row-reverse" : "flex-row",
            className,
            shadcnVariant
          )}
          href={item.url || ""}
          key={item.label}
        >
          <Link href={contextualHref(item.url || "")}>
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
  }
};
