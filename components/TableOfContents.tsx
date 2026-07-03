"use client";
import { cn } from "@/lib/utils";
import {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdClose } from "react-icons/md";
import { TbLayoutSidebar } from "react-icons/tb";

const TableOfContentsContext = createContext<{
  open: boolean;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
  tocRef: React.RefObject<HTMLDivElement> | null;
  setOpen: (isOpen: boolean) => void;
}>({
  open: false,
  buttonRef: null,
  tocRef: null,
  setOpen: () => {},
});

const useTableOfContents = () => useContext(TableOfContentsContext);

const Root = ({ children }: { children: ReactNode }) => {
  const tocRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tocRef.current &&
        buttonRef.current &&
        !tocRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <TableOfContentsContext.Provider
      value={{ buttonRef, tocRef, open, setOpen }}
    >
      {children}
    </TableOfContentsContext.Provider>
  );
};

type ButtonProps = {
  onClick: () => void;
  className?: string;
};

const Popover = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }) => {
  const { open, tocRef, setOpen } = useTableOfContents();
  return (
    <>
      {/* Dimmed backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* Left slide-in drawer (partial width) */}
      <div
        ref={tocRef}
        className={cn(
          className,
          "fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto border-r border-white/10 bg-black/95 shadow-xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-3 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">Table of Contents</h2>
          <button
            type="button"
            aria-label="Close table of contents"
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white p-1"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>
        {/* Close the drawer when a nav link inside is tapped */}
        <div className="py-3 px-7" onClick={() => setOpen(false)}>
          {children}
        </div>
      </div>
    </>
  );
});
Popover.displayName = "TableOfContents.Popover";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className }) => {
  const { setOpen, buttonRef, open } = useTableOfContents();
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Open table of contents"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg p-2 text-[#CC4141] transition-colors hover:text-white",
        className
      )}
      onClick={() => setOpen(!open)}
    >
      <TbLayoutSidebar className="h-5 w-5" strokeWidth={2} />
    </button>
  );
});

Button.displayName = "TableOfConents.Button";

export const TableOfContents = Object.assign({ Button, Popover, Root });
