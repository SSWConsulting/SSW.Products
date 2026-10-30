// The fallback category for posts nobody categorised, in each locale's
// content. It isn't shown as a label (#840)
const UNCATEGORIZED = ["uncategorized", "未分类"];

export const isUncategorized = (category?: string | null) =>
  !category || UNCATEGORIZED.includes(category.trim().toLowerCase());
