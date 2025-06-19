"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import Input from "@comps/Input";
import { Search } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { useSearchBox } from "react-instantsearch";

import { ReactNode } from "react";
import AlgoliaSearchProvider from "../../components/providers/AlgoliaSearchProvider";
import SearchResults from "./SearchResults";

const Trigger = ({ className }: { className?: string }) => {
  return (
    <DialogTrigger asChild>
      <Input
        placeholder="Search..."
        className={cn("mb-4 shadow-lg", className)}
        icon={Search}
      />
    </DialogTrigger>
  );
};

type SearchFieldProps = {
  className?: string;
};

const DialogContext = createContext<{
  setOpen: (value: boolean) => void;
}>({ setOpen: () => {} });

const DialogProvider = ({
  children,
  setOpen,
}: {
  children: ReactNode;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <DialogContext.Provider value={{ setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};
const useDialog = () => useContext(DialogContext);

const Root = ({ index, children }: { index: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <DialogProvider setOpen={setOpen}>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="box-border">
          <div className="max-w-3xl box-border relative w-[calc(100vw_-_2rem)]">
            <AlgoliaSearchProvider index={index}>
              <div className="h-full box-border pb-8 z-70 relative shadow-lg text-lg rounded-3xl text-white  bg-[#1F1F1F] border-2 border-gray-lighter/40">
                <div className="border-gray-lighter/40 px-4 py-2 align-middle items-center gap-5 flex relative w-full border-b">
                  <Search />
                  <SearchField className="w-full" />
                </div>
                <SearchResults />
              </div>
            </AlgoliaSearchProvider>

            <div className="absolute z-60 shadow-lg bg-gray-dark/75  inset-y-4 rounded-3xl inset-x-8 -bottom-4"></div>
          </div>
        </DialogContent>
        {children}
      </Dialog>
    </DialogProvider>
  );
};

const SearchField = ({ className }: SearchFieldProps) => {
  const { refine } = useSearchBox();
  return (
    <input
      type="text"
      className={cn(
        className,
        "bg-transparent outline-hidden placeholder-white! "
      )}
      placeholder="Search..."
      onChange={(e) => {
        refine(e.target.value);
      }}
    />
  );
};

export { Root, Trigger, useDialog };
