import { PackageOpen } from "lucide-react";
import { Hits, useInstantSearch } from "react-instantsearch";
import SearchHighlight from "./SearchHighlight";

const SearchResults = () => {
  const { results } = useInstantSearch();
  return (
    <>
      {results.nbHits === 0 && !results.__isArtificial ? (
        <p className="text-gray-light max-w-full truncate text-nowrap wrap gap-2 flex pt-2 px-4">
          <PackageOpen />
          No results...
        </p>
      ) : (
        <Hits
          className="max-h-96 [&>*]:pb-5 snap-mandatory snap-y  box-content [scrollbar-color:_theme(colors.gray.neutral)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative"
          hitComponent={SearchHighlight}
        />
      )}
    </>
  );
};

export default SearchResults;
