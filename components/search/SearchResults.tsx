import SearchHighlight from "./SearchHighlight";
import { usePagefindSearch } from "./usePagefindSearch";

const SearchResults = ({
  product,
  query,
}: {
  product: string;
  query: string;
}) => {
  const { results, error } = usePagefindSearch(product, query);
  const message = error
    ? "Search is unavailable right now"
    : results.length === 0 && query.trim() !== ""
      ? `No results found for "${query}"`
      : null;

  return (
    <>
      {message ? (
        <p className="text-[#797979] items-center justify-center max-w-full truncate text-nowrap wrap gap-2 flex pt-6 px-4">
          {message}
        </p>
      ) : (
        results.length > 0 && (
          <ol className="max-h-96 *:pb-5 snap-mandatory snap-y  box-content [scrollbar-color:var(--color-ssw-charcoal)_transparent] [scrollbar-width:thin] mask-[linear-gradient(transparent,white_3%,white_97%,transparent)] overflow-y-scroll relative">
            {results.map((result) => (
              <li key={result.id}>
                <SearchHighlight result={result} />
              </li>
            ))}
          </ol>
        )
      )}
    </>
  );
};

export default SearchResults;
