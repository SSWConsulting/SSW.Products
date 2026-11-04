"use client";

import { useEffect, useState } from "react";

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

// The index for each product is built by scripts/buildSearchIndex.mjs. Each
// product's module is cached on its own, so switching product (e.g. in the
// multi-product preview) never searches the previous product's index.
const pagefindByProduct = new Map<string, Promise<Pagefind>>();

const loadPagefind = (product: string): Promise<Pagefind> => {
  const key = product.toLowerCase();
  let pagefind = pagefindByProduct.get(key);
  if (!pagefind) {
    pagefind = import(
      /* webpackIgnore: true */ `/pagefind/${key}/pagefind.js`
    ) as Promise<Pagefind>;
    // Let a failed load be retried on the next search
    pagefind.catch(() => pagefindByProduct.delete(key));
    pagefindByProduct.set(key, pagefind);
  }
  return pagefind;
};

export const usePagefindSearch = (product: string, query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState(false);

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
        const pagefind = await loadPagefind(product);
        const response = await pagefind.debouncedSearch(
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
