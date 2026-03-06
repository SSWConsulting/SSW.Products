"use server";

import { getBlogsForProduct } from "@/utils/fetchBlogs";

type GetBlogsForProductProps = {
  startCursor?: string;
  offset?: number;
  limit?: number;
  keyword?: string;
  product: string;
  category?: string;
  filteredBlogs?: string[];
  locale?: string;
  branch?: string;
};

export async function getBlogsForProductAction(props: GetBlogsForProductProps) {
  return getBlogsForProduct(props);
}
