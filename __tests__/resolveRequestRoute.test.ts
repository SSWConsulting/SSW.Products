import { resolveRequestRoute } from "@utils/resolveRequestRoute";

const productList = [
  { product: "YakShaver", domain: "yakshaver.ai" },
  { product: "SSW", domain: "ssw.com.au" },
];
const env = { defaultProduct: "YakShaver" };

describe("resolveRequestRoute", () => {
  it("production en domain → /en/<product>/path", () => {
    expect(
      resolveRequestRoute({ hostname: "ssw.com.au", pathname: "/about", productList, env })
    ).toEqual({ locale: "en", product: "SSW", internalPath: "/en/SSW/about" });
  });
  it("production Chinese domain → /zh/YakShaver/path", () => {
    expect(
      resolveRequestRoute({ hostname: "yakshaver.cn", pathname: "/features", productList, env })
    ).toEqual({ locale: "zh", product: "YakShaver", internalPath: "/zh/YakShaver/features" });
  });
  it("production www Chinese domain → zh", () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      resolveRequestRoute({ hostname: "www.yakshaver.com.cn", pathname: "/", productList, env })!.locale
    ).toBe("zh");
  });
  it("root path on en domain → /en/<product>", () => {
    expect(
      resolveRequestRoute({ hostname: "yakshaver.ai", pathname: "/", productList, env })
    ).toEqual({ locale: "en", product: "YakShaver", internalPath: "/en/YakShaver" });
  });
  it("local default product, en", () => {
    expect(
      resolveRequestRoute({ hostname: "localhost:3000", pathname: "/blog", productList, env })
    ).toEqual({ locale: "en", product: "YakShaver", internalPath: "/en/YakShaver/blog" });
  });
  it("local /zh prefix → zh, prefix stripped", () => {
    expect(
      resolveRequestRoute({ hostname: "localhost:3000", pathname: "/zh/blog", productList, env })
    ).toEqual({ locale: "zh", product: "YakShaver", internalPath: "/zh/YakShaver/blog" });
  });
  it("local path starting with a product is not double-prefixed", () => {
    expect(
      resolveRequestRoute({ hostname: "localhost:3000", pathname: "/SSW/about", productList, env })
    ).toEqual({ locale: "en", product: "SSW", internalPath: "/en/SSW/about" });
  });
  it("staging (vercel.app) behaves like local", () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      resolveRequestRoute({ hostname: "ssw-products.vercel.app", pathname: "/", productList, env })!.product
    ).toBe("YakShaver");
  });
  it("unknown production host → null", () => {
    expect(
      resolveRequestRoute({ hostname: "unknown.example.com", pathname: "/", productList, env })
    ).toBeNull();
  });
});
