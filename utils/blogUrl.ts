"use client";

export const useBlogUrl = (currentLocale: string) => {
  return (slug: string) => {
    return currentLocale === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;
  };
};

export const getBlogUrl = (slug: string, locale?: string) => {
  return locale === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;
};