"use client";
import { usePathname } from 'next/navigation';

export const useBlogUrl = () => {
  const pathname = usePathname();
  const isZhLocale = pathname.startsWith('/zh');
  
  return (slug: string) => {
    return isZhLocale ? `/zh/blog/${slug}` : `/blog/${slug}`;
  };
};

export const getBlogUrl = (slug: string, locale?: string) => {
  return locale === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;
};