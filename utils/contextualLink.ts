'use client';

import { usePathname } from 'next/navigation';
import { useHostname } from '@comps/providers/HostnameProvider';

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
 * The hostname comes from HostnameProvider (resolved server-side from the request headers)
 * because it is not observable during SSR. That matters on the .cn domains: they take their
 * locale from the host and serve unprefixed paths, but middleware *rewrites* rather than
 * redirects, so a /zh/... URL can still reach the app there with the prefix intact. Without
 * the host, SSR would emit /zh links while the hydrated client emits bare ones.
 *
 * `hostnameOverride` exists for callers that already hold the hostname; it takes precedence
 * over the context.
 */
export const useContextualLink = (hostnameOverride?: string) => {
  const pathname = usePathname() ?? '';
  const contextHostname = useHostname();
  const hostname =
    hostnameOverride ??
    contextHostname ??
    (typeof window === 'undefined' ? '' : window.location.hostname);

  return (href: string) => getContextualHref(href, pathname, hostname);
};
