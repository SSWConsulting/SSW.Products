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
import { MdClose, MdMenu } from "react-icons/md";

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
  { children: React.ReactNode; open: boolean; closeCallback: () => void }
>(({ children, closeCallback }, ref) => {
  const { open, tocRef, setOpen } = useTableOfContents();
  return (
    <div
      onClick={() => setOpen(false)}
      ref={tocRef}
      className={`${
        open ? "block" : "hidden"
      } absolute top-full left-0 right-0 z-30 bg-black/95 rounded-lg border border-white/10 shadow-xl overflow-y-auto`}
    >
      <div className="flex justify-between items-center p-3 border-b border-white/10">
        <h2 className="text-lg font-medium text-white">Table of Contents</h2>
        <button className="text-white/60 hover:text-white p-1">
          <MdClose className="h-5 w-5" />
        </button>
      </div>
      <div className="py-3 px-7">{children}</div>
    </div>
  );
});
Popover.displayName = "TableOfContents.Popover";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className }, ref) => {
    const { setOpen, buttonRef, open } = useTableOfContents();
    return (
      <button
        ref={buttonRef}
        className={cn(
          "flex justify-center items-center gap-2 w-full text-white/60 hover:text-white transition-all duration-300 bg-white/10 p-2 rounded-lg",
          className
        )}
        onClick={() => setOpen(!open)}
      >
        <MdMenu className="text-[#CC4141]" />
        <span className="font-light">Table of Contents</span>
      </button>
    );
  }
);

Button.displayName = "TableOfConents.Button";

export const TableOfContents = Object.assign({ Button, Popover, Root });
