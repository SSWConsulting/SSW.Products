import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Input from "@comps/Input";
import { Search } from "lucide-react";
import { useSearchBox } from "react-instantsearch";

import AlgoliaSearchProvider from "../../components/providers/AlgoliaSearchProvider";
import SearchResults from "./SearchResults";
export const SearchBox = ({
  className,
  index,
}: {
  className?: string;
  index: string;
}) => {
  return (
    <Dialog>
      <DialogContent className="box-border ">
        <div className="max-w-3xl box-border relative w-offset-4">
          <AlgoliaSearchProvider index={index}>
            <div className="h-full box-border pb-8 z-[70] relative shadow-lg text-lg rounded-3xl text-white  bg-[#1F1F1F] border-2 border-gray-lighter/40">
              <div className="border-gray-lighter/40 px-4 py-2 align-middle items-center gap-5 flex relative w-full border-b-[1px]">
                <Search />
                <SearchField className="w-full" />
              </div>
              <SearchResults />
            </div>
          </AlgoliaSearchProvider>

          <div className="absolute z-[60] shadow-lg bg-gray-dark/75  inset-y-4 rounded-3xl inset-x-8 -bottom-4"></div>
        </div>
      </DialogContent>
      <DialogTrigger asChild>
        <Input
          placeholder="Search..."
          className={cn("mb-4 shadow-lg mx-4", className)}
          icon={Search}
        />
      </DialogTrigger>
    </Dialog>
  );
};

type SearchFieldProps = {
  className?: string;
};

const SearchField = ({ className }: SearchFieldProps) => {
  const { refine } = useSearchBox();
  return (
    <input
      type="text"
      className={cn(
        className,
        "bg-transparent outline-none placeholder-white "
      )}
      placeholder="Search..."
      onChange={(e) => {
        refine(e.target.value);
      }}
    />
  );
};

export default SearchBox;
