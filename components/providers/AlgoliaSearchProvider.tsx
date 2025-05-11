"use client";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useEffect } from "react";
import { InstantSearchNext } from "react-instantsearch-nextjs";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""
);
const AlgoliaSearchProvider = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: string;
}) => {
  useEffect(() => {
    console.log("index", index);
  }, [index]);
  return (
    <>
      <InstantSearchNext indexName={index} searchClient={searchClient}>
        {children}
      </InstantSearchNext>
    </>
  );
};

export default AlgoliaSearchProvider;
