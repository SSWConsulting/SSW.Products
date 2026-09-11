'use client';

import { usePathname } from 'next/navigation';

const isExternalOrAnchor = (href: string) => href.startsWith('http') || href.startsWith('#');
const isChineseDomain = (hostname: string) => hostname.endsWith('.cn');
const isChineseContext = (pathname: string) => pathname.startsWith('/zh/') || pathname === '/zh';

export const getContextualHref = (href: string, currentPathname: string, hostname: string): string => {
  if (isExternalOrAnchor(href) || isChineseDomain(hostname)) return href;
  if (isChineseContext(currentPathname)) return href.startsWith('/zh/') ? href : `/zh${href}`;
  return href;
};

/**
 * Builds locale-aware hrefs.
 *
 * `usePathname` is used instead of `window.location.pathname` so Chinese pages also get
 * /zh-prefixed links in the server-rendered HTML. Reading `window` for the pathname made
 * this hook a no-op during SSR, which shipped English hrefs to every /zh/ page.
 *
 * The .cn domains take their locale from the host and serve unprefixed paths, so their
 * hrefs must be left untouched. Middleware *rewrites* rather than redirects, so a
 * /zh/... URL can still reach the app on a .cn host with the prefix intact. The hostname
 * is therefore the only way to tell those apart, and it is not observable during SSR --
 * pass `hostnameOverride` (from the server's own request headers) wherever that matters
 * to keep SSR and client markup identical.
 */
export const useContextualLink = (hostnameOverride?: string) => {
  const pathname = usePathname() ?? '';
  const hostname =
    hostnameOverride ?? (typeof window === 'undefined' ? '' : window.location.hostname);

  return (href: string) => getContextualHref(href, pathname, hostname);
};
