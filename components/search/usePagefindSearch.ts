"use client";

import { useEffect, useRef, useState } from "react";

// The shape of what Pagefind returns - see https://pagefind.app/docs/api/
type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: { title?: string };
};

type Pagefind = {
  debouncedSearch: (
    query: string,
    options?: object,
    debounceMs?: number
  ) => Promise<{
    results: { id: string; data: () => Promise<PagefindResultData> }[];
  } | null>;
};

export type SearchResult = {
  id: string;
  url: string;
  title: string;
  // HTML from Pagefind - the matched words are wrapped in <mark>
  excerpt: string;
};

const MAX_RESULTS = 20;

// The index for each product is built by scripts/buildSearchIndex.mjs
const loadPagefind = (product: string): Promise<Pagefind> =>
  import(
    /* webpackIgnore: true */ `/pagefind/${product.toLowerCase()}/pagefind.js`
  );

export const usePagefindSearch = (product: string, query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState(false);
  const pagefind = useRef<Promise<Pagefind> | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    // A slower response for an older query must not replace a newer one
    let cancelled = false;

    const search = async () => {
      try {
        pagefind.current ??= loadPagefind(product);
        const response = await (await pagefind.current).debouncedSearch(
          trimmed,
          {},
          150
        );
        // null means a newer search superseded this one
        if (!response || cancelled) return;

        const data = await Promise.all(
          response.results.slice(0, MAX_RESULTS).map(async (result) => ({
            id: result.id,
            ...(await result.data()),
          }))
        );
        if (cancelled) return;

        setError(false);
        setResults(
          data.map(({ id, url, excerpt, meta }) => ({
            id,
            url,
            excerpt,
            title: meta.title ?? url,
          }))
        );
      } catch (e) {
        console.error("Docs search failed:", e);
        pagefind.current = null;
        if (!cancelled) setError(true);
      }
    };

    search();
    return () => {
      cancelled = true;
    };
  }, [product, query]);

  return { results, error };
};
