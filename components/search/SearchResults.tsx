import SearchHighlight from "./SearchHighlight";
import { usePagefindSearch } from "./usePagefindSearch";

const SearchResults = ({
  product,
  query,
}: {
  product: string;
  query: string;
}) => {
  const { results, searched, error } = usePagefindSearch(product, query);

  if (searched && (error || results.length === 0)) {
    return (
      <p className="text-[#797979] items-center justify-center max-w-full truncate text-nowrap wrap gap-2 flex pt-6 px-4">
        {error
          ? "Search is unavailable right now"
          : `No results found for "${query.trim()}"`}
      </p>
    );
  }

  if (results.length === 0) return null;

  return (
    <ol className="max-h-96 *:pb-5 snap-mandatory snap-y  box-content [scrollbar-color:var(--color-ssw-charcoal)_transparent] [scrollbar-width:thin] mask-[linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative">
      {results.map((result) => (
        <li key={result.url}>
          <SearchHighlight result={result} />
        </li>
      ))}
    </ol>
  );
};

export default SearchResults;
