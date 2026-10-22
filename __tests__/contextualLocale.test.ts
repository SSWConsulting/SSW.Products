import { getContextualLocale } from "../utils/contextualLink";

describe("getContextualLocale", () => {
  it("reads English from an unprefixed path on the global domain", () => {
    expect(getContextualLocale("/", "yakshaver.ai")).toBe("en");
  });

  it("reads Chinese from a /zh path on the global domain", () => {
    expect(getContextualLocale("/zh", "yakshaver.ai")).toBe("zh");
    expect(getContextualLocale("/zh/pricing", "yakshaver.ai")).toBe("zh");
  });

  // The .cn domains take their locale from the host, so a bare "/" differs by domain.
  it("reads Chinese from an unprefixed path on a .cn domain", () => {
    expect(getContextualLocale("/", "yakshaver.com.cn")).toBe("zh");
    expect(getContextualLocale("/pricing", "yakshaver.com.cn")).toBe("zh");
  });

  // Middleware rewrites rather than redirects, so /zh can reach a .cn host intact.
  it("reads Chinese from a /zh path on a .cn domain", () => {
    expect(getContextualLocale("/zh/pricing", "yakshaver.com.cn")).toBe("zh");
  });

  // "/zhang" starts with "zh" but is not the locale segment.
  it("does not treat a path merely starting with zh as Chinese", () => {
    expect(getContextualLocale("/zhangsan", "yakshaver.ai")).toBe("en");
  });
});
