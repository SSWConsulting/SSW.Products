"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import Input from "@comps/Input";
import { Search } from "lucide-react";
import { createContext, useContext, useState } from "react";

import { ReactNode } from "react";
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

const Root = ({
  product,
  children,
}: {
  product: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DialogProvider setOpen={setOpen}>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="box-border">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Type to search this site
          </DialogDescription>
          <div className="max-w-3xl box-border relative w-[calc(100vw_-_2rem)]">
            <SearchPanel product={product} />

            <div className="absolute z-60 shadow-lg bg-gray-dark/75  inset-y-4 rounded-3xl inset-x-8 -bottom-4"></div>
          </div>
        </DialogContent>
        {children}
      </Dialog>
    </DialogProvider>
  );
};

// Lives inside the dialog content, so the query is cleared each time the dialog
// closes - the same as when the search was powered by Algolia
const SearchPanel = ({ product }: { product: string }) => {
  const [query, setQuery] = useState("");
  return (
    <div className="h-full box-border pb-8 z-70 relative shadow-lg text-lg rounded-3xl text-white  bg-[#1F1F1F] border-2 border-gray-lighter/40">
      <div className="border-gray-lighter/40 px-4 py-2 align-middle items-center gap-5 flex relative w-full border-b">
        <Search />
        <input
          type="text"
          className="w-full bg-transparent outline-hidden placeholder-white!"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <SearchResults product={product} query={query} />
    </div>
  );
};

export { Root, Trigger, useDialog };
