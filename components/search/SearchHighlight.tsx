import Link from "next/link";

import { useDialog } from "./SearchBox";
import type { SearchResult } from "./usePagefindSearch";

const SearchHighlight = ({ result }: { result: SearchResult }) => {
  const { setOpen } = useDialog();
  return (
    <div className="border-b snap-start py-1 px-4 border-gray-lighter/40">
      <Link
        onClick={() => setOpen(false)}
        className="hover:underline underline-offset-2 text-lg"
        href={result.url}
      >
        {result.title}
      </Link>
      {/* Pagefind escapes the doc text and only adds the <mark> tags */}
      <p
        className="truncate text-sm overflow-hidden block text-[#797979] [&_mark]:bg-yellow-400 [&_mark]:text-black"
        dangerouslySetInnerHTML={{ __html: result.excerpt }}
      />
    </div>
  );
};

export default SearchHighlight;
