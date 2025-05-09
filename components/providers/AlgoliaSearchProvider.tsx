"use client";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";

const AlgoliaSearchProvider = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: string;
}) => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""
  );
  return (
    <InstantSearch indexName={index} searchClient={searchClient}>
      {children}
    </InstantSearch>
  );
};

export default AlgoliaSearchProvider;
