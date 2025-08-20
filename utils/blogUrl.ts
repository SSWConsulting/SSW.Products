"use client";

export const getBlogUrl = (slug: string, locale?: string) => 
  locale === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;

export const useBlogUrl = (currentLocale: string) => 
  (slug: string) => getBlogUrl(slug, currentLocale);