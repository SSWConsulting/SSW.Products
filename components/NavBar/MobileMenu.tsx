import GrowingLink from "@comps/GrowingLink";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
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

const MobileAnchor = Popover.Anchor;

const MobileMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

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


const MobileMenuContent = ({ children, headerHeight }: { children: React.ReactNode; headerHeight: number }) => {
  const contentHeight = `calc(100svh - ${headerHeight}px)`;
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
            className="flex flex-col flex-wrap content-start gap-x-8 gap-y-4 items-start min-h-0 h-full overflow-hidden pb-8"
            style={{ height: contentHeight, maxHeight: contentHeight }}
          >
            {children}
          </ul>
        </div>
      </div>
    </Popover.Content>
  );
};

export { MobileAnchor, MobileMenuContent, MobileMenuItem, MobileMenuRoot, MobileMenuTrigger, useMenuContext };
