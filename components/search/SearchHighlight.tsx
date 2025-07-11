import type { Hit } from "instantsearch.js";
import Link from "next/link";
import { Highlight, Snippet } from "react-instantsearch";

import { useDialog } from "./SearchBox";

const SearchHighlight = ({
  hit,
}: {
  hit: Hit<{
    title: string;
    body: string;
    file: string;
  }>;
}) => {
  const { setOpen } = useDialog();
  return (
    <div className="border-b snap-start py-1 px-4 border-gray-lighter/40">
      <Link
        onClick={() => setOpen(false)}
        className="hover:underline underline-offset-2"
        href={`/docs/${hit?.file}`}
      >
        <Highlight
          className="text-lg"
          highlightedTagName={({ children }) => (
            <span className="bg-yellow-400 text-black">{children}</span>
          )}
          attribute="title"
          hit={hit}
        />
      </Link>
      <Snippet
        className="truncate text-sm overflow-hidden block text-[#797979]"
        highlightedTagName={({ children }) => (
          <span className="bg-yellow-400 text-black">{children}</span>
        )}
        hit={hit}
        attribute="body"
      />
    </div>
  );
};

export default SearchHighlight;
