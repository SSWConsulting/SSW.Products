import useIsScrolled from "@comps/hooks/useIsScrolled";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { getLocalizedPath } from "@utils/environment";

interface NavigationMenuBadgeProps {
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
  currentLocale?: string;
}

const NavigationMenuBadge = ({
  imgSrc,
  imgWidth,
  imgHeight,
  currentLocale = "en",
}: NavigationMenuBadgeProps) => (
  <NavigationMenu.Item className="gap-8 mx-auto flex items-center w-full">
    <Link className="mb-2 shrink-0" href={getLocalizedPath("/", currentLocale)}>
      <Image
        src={imgSrc}
        className="h-8 w-auto"
        width={imgWidth}
        height={imgHeight}
        alt="Logo"
      />
    </Link>
  </NavigationMenu.Item>
);

interface NavigationMenuRootProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenu.Root> {
  mobileOpened?: boolean;
}

const NavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.Root>,
  NavigationMenuRootProps
>(({ children, mobileOpened = false }, ref) => {
  const { scrolled } = useIsScrolled();
  return (
    <NavigationMenu.Root
      className={clsx(
        `text-white sticky transition-colors justify-center z-10  duration-200 ease-in-out`,
        scrolled
          ? `shadow-xs ${
              mobileOpened ? "bg-black" : "bg-transparent"
            } my-2 py-4 px-6 animate-slide animate-in slide-in-from-top-3 backdrop-blur-sm animate-slide-in top-0 `
          : `p-6 ${mobileOpened ? "bg-black" : "bg-transparent"}`,
        `z-40 w-full`
      )}
      ref={ref}
    >
      <NavigationMenu.List className="sm:flex gap-x-5 sm:gap-y-0 gap-y-4 sm:gap-x-0 grid-cols-2 grid mx-4 xl:mx-auto max-w-7xl m-0 justify-center">
        {children}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
});

const NavigationMenuItem = NavigationMenu.Item;

NavigationMenuRoot.displayName = "NavigationMenuRoot";

export { NavigationMenuBadge, NavigationMenuItem, NavigationMenuRoot };
