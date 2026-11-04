"use client";

import { useEffect, useState } from "react";

// What Pagefind returns - see https://pagefind.app/docs/api/
type Pagefind = {
  debouncedSearch: (
    query: string,
    options?: object,
    debounceMs?: number
  ) => Promise<{
    results: {
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta: { title?: string };
      }>;
    }[];
  } | null>;
};

export type SearchResult = {
  url: string;
  title: string;
  // HTML from Pagefind - the matched words are wrapped in <mark>
  excerpt: string;
};

const MAX_RESULTS = 20;

// Each product has its own index (built by scripts/buildSearchIndex.mjs), so the
// module is cached per product - switching product never searches the old one.
const pagefindByProduct = new Map<string, Promise<Pagefind>>();

const loadPagefind = (product: string) => {
  const key = product.toLowerCase();
  if (!pagefindByProduct.has(key)) {
    const pagefind: Promise<Pagefind> = import(
      /* webpackIgnore: true */ `/pagefind/${key}/pagefind.js`
    );
    // Let a failed load be retried on the next search
    pagefind.catch(() => pagefindByProduct.delete(key));
    pagefindByProduct.set(key, pagefind);
  }
  return pagefindByProduct.get(key)!;
};

export const usePagefindSearch = (product: string, query: string) => {
  const trimmed = query.trim();
  // Remembers which query the results belong to, so "no results" only shows
  // once the current query has actually been searched
  const [state, setState] = useState({
    query: "",
    results: [] as SearchResult[],
    error: false,
  });

  useEffect(() => {
    if (!trimmed) return;
    // A slower response for an older query must not replace a newer one
    let cancelled = false;

    (async () => {
      try {
        const pagefind = await loadPagefind(product);
        // null means a newer search superseded this one
        const search = await pagefind.debouncedSearch(trimmed, {}, 150);
        if (!search || cancelled) return;

        const data = await Promise.all(
          search.results.slice(0, MAX_RESULTS).map((result) => result.data())
        );
        if (cancelled) return;

        setState({
          query: trimmed,
          error: false,
          results: data.map(({ url, excerpt, meta }) => ({
            url,
            excerpt,
            title: meta.title ?? url,
          })),
        });
      } catch (e) {
        console.error("Docs search failed:", e);
        if (!cancelled) setState({ query: trimmed, results: [], error: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product, trimmed]);

  return {
    // Keeps showing the last results while the next query is being searched
    results: trimmed ? state.results : [],
    searched: trimmed !== "" && state.query === trimmed,
    error: state.error,
  };
};
