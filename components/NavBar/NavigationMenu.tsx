import useIsScrolled from "@comps/hooks/useIsScrolled";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import * as React from "react";

// ForwardRef wrapper for NavigationMenu.Root
export const NavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Root>
>(({ children }, ref) => {
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
      ref={ref}
    >
      {children}
    </NavigationMenu.Root>
  );
});

NavigationMenuRoot.displayName = "NavigationMenuRoot";
