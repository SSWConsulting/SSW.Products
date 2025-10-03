const isExternalOrAnchor = (href: string) => href.startsWith('http') || href.startsWith('#');
const isChineseDomain = (hostname: string) => hostname.endsWith('.cn');
const isChineseContext = (pathname: string) => pathname.startsWith('/zh/') || pathname === '/zh';

export const getContextualHref = (href: string, currentPathname: string, hostname: string): string => {
  if (isExternalOrAnchor(href) || isChineseDomain(hostname)) return href;
  if (isChineseContext(currentPathname)) return href.startsWith('/zh/') ? href : `/zh${href}`;
  return href;
};

export const useContextualLink = () => {
  if (typeof window === 'undefined') return (href: string) => href;
  
  const { hostname, pathname } = window.location;
  return (href: string) => getContextualHref(href, pathname, hostname);
};
