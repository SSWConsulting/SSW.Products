"use client";

export const getBlogUrl = (slug: string, locale = 'en') => 
  locale === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;

export const useBlogUrl = (currentLocale = 'en') => 
  (slug: string) => getBlogUrl(slug, currentLocale);