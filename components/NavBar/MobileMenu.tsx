import GrowingLink from "@comps/GrowingLink";
import useMatchMedia from "@comps/hooks/useMatchMedia";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";

type MenuContextType = { setIsOpen: (open: boolean) => void; isOpen: boolean };

const MenuContext = React.createContext<MenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

const useMenuContext = () => React.useContext(MenuContext);

const MenuContextProvider = MenuContext.Provider;

const HeaderHeightContext = React.createContext<number | null>(null);

const useHeaderHeight = () => React.useContext(HeaderHeightContext);

function HeaderHeightProvider({
  anchorRef,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;

    const update = () => setHeight(el.getBoundingClientRect().height);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [anchorRef]);

  return (
    <HeaderHeightContext.Provider value={height}>
      {children}
    </HeaderHeightContext.Provider>
  );
}

const MobileAnchor = Popover.Anchor;

const MobileMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMatchMedia("(max-width: 1279px)");

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  return (
    <MenuContextProvider value={{ setIsOpen, isOpen }}>
      <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        {children}
      </Popover.Root>
   
    </MenuContextProvider>
  );
};

const MobileMenuItem = ({ href, label, openInNewTab = false }: { href: string; label: string, openInNewTab: boolean }) => {
  const { setIsOpen } = useMenuContext();
  return (
    <li className="flex items-center py-1 mb-0">
      <GrowingLink 
        {...(openInNewTab ? { target: "_blank"} : {})}
        onClick={()=> setIsOpen(false)}
        href={href} 
        underlineColor="red"
        className="uppercase mb-0 underline-offset-4 text-md flex items-center gap-1 min-h-9 min-w-9"
        >
          {label}
          {href &&
            (href.startsWith("http://") || href.startsWith("https://")) && (
              <FaExternalLinkAlt className="text-xs text-ssw-red opacity-50" />
            )}
      </GrowingLink>
    </li>
  );
};

const MobileMenuTrigger = () => {
  const { isOpen } = useMenuContext();

  return (
    <Popover.Trigger asChild>
      <button aria-label="Toggle menu" className="text-3xl my-auto flex align-middle min-h-11 min-w-11 items-center justify-center">
        {isOpen ? <CgClose /> : <HiOutlineBars3 />}
      </button>
    </Popover.Trigger>
  );
};


const MobileMenuContent = ({ children }: { children: React.ReactNode }) => {
  const headerHeight = useHeaderHeight();
  const contentHeight =
    headerHeight != null
      ? `calc(100vh - ${headerHeight}px)`
      : "100vh";
  return (
    <Popover.Content
      asChild
      className={clsx(
        "bg-black min-w-screen duration-300 overflow-hidden z-50 py-7 px-7 xl:hidden data-[state=open]:animate-expand text-white transition data-[state=closed]:animate-collapse top-full min-h-0"
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className="min-h-0 overflow-hidden"
          style={{ height: contentHeight, maxHeight: contentHeight }}
        >
          <ul
            className="flex flex-col flex-wrap content-start gap-x-16 gap-y-4 items-start min-h-0 h-full overflow-hidden pb-8"
            style={{ height: contentHeight, maxHeight: contentHeight }}
          >
            {children}
          </ul>
        </div>
      </div>
    </Popover.Content>
  );
};

export {
  MobileAnchor,
  MobileMenuContent,
  MobileMenuItem,
  MobileMenuRoot,
  MobileMenuTrigger,
  HeaderHeightProvider,
  useMenuContext,
  useHeaderHeight,
};
