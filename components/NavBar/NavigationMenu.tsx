import useIsScrolled from "@comps/hooks/useIsScrolled";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavigationMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const { scrolled } = useIsScrolled();
  return (
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
        {children}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

const NavigationMenuLink = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <NavigationMenu.Item className="my-auto hidden xl:block">
      <Link
        href={href}
        className="px-3 hover:decoration-ssw-red decoration-transparent underline-offset-3 underline text-base block h-fit rounded transition-colors uppercase"
      >
        {label}
      </Link>
    </NavigationMenu.Item>
  );
};

const NavigationMenuBrand = ({
  imgSrc,
  imgHeight,
  imgWidth,
}: {
  imgSrc: string;
  imgHeight: number;
  imgWidth: number;
}) => {
  return (
    <NavigationMenu.Item className="gap-8  mx-auto flex items-center w-full">
      <Link className="mb-2 shrink-0" href="/">
        <Image
          src={imgSrc as string}
          className="h-8 w-auto"
          width={imgWidth}
          height={imgHeight}
          alt="Logo"
        />
      </Link>
    </NavigationMenu.Item>
  );
};

export { NavigationMenuBrand, NavigationMenuLink, NavigationMenuRoot };
