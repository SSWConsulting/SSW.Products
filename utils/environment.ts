const PRODUCTION_HOSTS = new Set(['yakshaver.ai', 'yakshaver.cn', 'www.yakshaver.cn', 'yakshaver.com.cn', 'www.yakshaver.com.cn']);

export const isProductionEnvironment = (): boolean => 
  typeof window !== 'undefined' && PRODUCTION_HOSTS.has(window.location.hostname);

export const getLocalizedPath = (path: string, locale = 'en'): string => 
  isProductionEnvironment() || locale !== 'zh' ? path : `/zh${path}`;

export const cleanPathForLocale = (pathname: string, currentLocale = 'en'): string => 
  isProductionEnvironment() || currentLocale !== 'zh' 
    ? pathname 
    : pathname.replace(/^\/zh/, '') || '/';
