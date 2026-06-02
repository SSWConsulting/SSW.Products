import { localeFromBreadcrumbs } from "@utils/localeFromBreadcrumbs";

describe("localeFromBreadcrumbs", () => {
  it("returns 'en' for a top-level file", () => {
    expect(localeFromBreadcrumbs(["YakShaver", "home"])).toBe("en");
  });
  it("returns 'zh' when second segment is zh", () => {
    expect(localeFromBreadcrumbs(["YakShaver", "zh", "home"])).toBe("zh");
  });
  it("returns 'en' for other products", () => {
    expect(localeFromBreadcrumbs(["SSW", "about"])).toBe("en");
  });
  it("handles empty/short arrays", () => {
    expect(localeFromBreadcrumbs([])).toBe("en");
    expect(localeFromBreadcrumbs(["YakShaver"])).toBe("en");
  });
});
