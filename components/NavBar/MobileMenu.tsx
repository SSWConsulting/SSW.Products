import useIsScrolled from "@comps/hooks/useIsScrolled";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
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
  return (
    <MenuContextProvider value={{ setIsOpen, isOpen }}>
      <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        {children}
      </Popover.Root>
   
    </MenuContextProvider>
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

const MobileMenuTrigger = () => {
  const { isOpen } = useMenuContext();

  return (
    <Popover.Trigger asChild>
      <button className="text-3xl my-auto flex align-middle">
        {isOpen ? <CgClose /> : <HiOutlineBars3 />}
      </button>
    </Popover.Trigger>
  );
};

const MobileMenuContent = ({ children }: { children: React.ReactNode }) => {
  const { scrolled } = useIsScrolled();

  return (
    <Popover.Content
      asChild
      className={clsx(
        scrolled ? "bg-stone-700 " : "bg-opacity-90 bg-gray-light/90",
        "min-w-screen duration-300 overflow-hidden z-50 py-5 px-7 xl:hidden data-[state=open]:animate-expand text-white transition  data-[state=closed]:animate-collapse top-full flex flex-col items-start space-y-2"
      )}
    >
      <ul>{children}</ul>
    </Popover.Content>
  );
};
export {
  MobileAnchor,
  MobileMenuContent,
  MobileMenuItem,
  MobileMenuRoot,
  MobileMenuTrigger,
  useMenuContext,
};
