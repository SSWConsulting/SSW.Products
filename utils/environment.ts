const PRODUCTION_HOSTS = ['yakshaver.ai', 'yakshaver.cn', 'yakshaver.com.cn'] as const;

export const isProductionEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return PRODUCTION_HOSTS.includes(window.location.hostname as any);
};

export const getLocalizedPath = (path: string, locale: string): string => 
  isProductionEnvironment() ? path : (locale === 'zh' ? `/zh${path}` : path);

export const cleanPathForLocale = (pathname: string, currentLocale: string): string => {
  if (isProductionEnvironment()) return pathname;
  return currentLocale === 'zh' ? pathname.replace(/^\/zh/, '') || '/' : pathname;
};