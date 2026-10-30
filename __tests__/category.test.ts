import { isUncategorized } from "../utils/category";

describe("isUncategorized", () => {
  it("matches the fallback category in English and Chinese content", () => {
    expect(isUncategorized("Uncategorized")).toBe(true);
    expect(isUncategorized("未分类")).toBe(true);
  });

  it("treats a missing category as uncategorized", () => {
    expect(isUncategorized(undefined)).toBe(true);
    expect(isUncategorized(null)).toBe(true);
    expect(isUncategorized("")).toBe(true);
  });

  it("keeps real categories", () => {
    expect(isUncategorized("What's New")).toBe(false);
    expect(isUncategorized("最新动态")).toBe(false);
  });
});
