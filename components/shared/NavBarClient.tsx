"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import Image from "next/image";
import Link from "next/link";

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
import { NavigationMenuRoot } from "@comps/NavBar/NavigationMenu";
import { SubGroupContent, SubGroupTrigger } from "@comps/NavBar/SubGroup";
import { Button } from "@comps/ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";
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

export default function NavBarClient({
  buttons,
  items,
  bannerImage,
}: NavBarClientProps) {
  return (
    <MobileMenuRoot>
      <MobileAnchor asChild>
        <NavigationMenuRoot>
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
                  <SubGroupTrigger label={item.label} />
                  <SubGroupContent>
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
                  </SubGroupContent>
                </NavigationMenu.Item>
              );
            } else if (
              item.__typename === "NavigationBarLeftNavItemStringItem"
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
            <MobileMenuTrigger />
            <MobileMenuContent>
              <>
                {items.map((item, index) => {
                  if (!item) return <></>;

                  if (
                    item.__typename ===
                    "NavigationBarLeftNavItemGroupOfStringItems"
                  ) {
                    if (!item.items) return <></>;

                    return item.items.map((subItem, subIndex) => {
                      return (
                        <MobileMenuItem
                          key={subIndex}
                          href={subItem.href}
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
                        href={item.href}
                        key={index}
                      />
                    );
                  }
                })}
              </>
            </MobileMenuContent>
          </NavigationMenu.Item>

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
        </NavigationMenuRoot>
      </MobileAnchor>
    </MobileMenuRoot>
  );
}

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
