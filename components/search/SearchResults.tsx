import { PackageOpen } from "lucide-react";
import { Hits, useInstantSearch } from "react-instantsearch";
import SearchHighlight from "./SearchHighlight";

const SearchResults = () => {
  const { results } = useInstantSearch();
  return (
    <>
      {results.nbHits === 0 && results.query !== "" ? (
        <p className="text-[#797979] items-center justify-center max-w-full truncate text-nowrap wrap gap-2 flex pt-6 px-4">
          No results found for "{results.query}"
        </p>
      ) : (
        <Hits
          className="max-h-96 *:pb-5 snap-mandatory snap-y  box-content [scrollbar-color:var(--color-ssw-charcoal)_transparent] [scrollbar-width:thin] mask-[linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative"
          hitComponent={SearchHighlight}
        />
      )}
    </>
  );
};

export default SearchResults;
