import { NextRequest } from "next/server";
import { config, middleware, PREVIEW_PRODUCT_COOKIE } from "../middleware";

const productList = [
  { product: "YakShaver", domain: "yakshaver.ai" },
  { product: "EagleEye", domain: "ssweagleeye.com" },
  { product: "Tiger", domain: "sswtiger.com" },
];

function faviconRequest(host: string, cookie?: string) {
  const headers: Record<string, string> = { host };
  if (cookie) {
    headers.cookie = `${PREVIEW_PRODUCT_COOKIE}=${cookie}`;
  }
  return new NextRequest(`https://${host}/favicon.ico`, { headers });
}

function rewrittenPath(response: Response) {
  const rewrite = response.headers.get("x-middleware-rewrite");
  return rewrite ? new URL(rewrite).pathname : null;
}

describe("/favicon.ico", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PRODUCT_LIST = JSON.stringify(productList);
    process.env.DEFAULT_PRODUCT = "YakShaver";
  });

  it("runs the middleware for /favicon.ico", () => {
    expect(config.matcher).toContain("/favicon.ico");
  });

  it.each([
    ["yakshaver.ai", "/favicons/YakShaver.ico"],
    ["ssweagleeye.com", "/favicons/EagleEye.ico"],
    ["sswtiger.com", "/favicons/Tiger.ico"],
    ["yakshaver.cn", "/favicons/YakShaver.ico"],
  ])("serves %s its own icon", (host, icon) => {
    expect(rewrittenPath(middleware(faviconRequest(host)))).toBe(icon);
  });

  it("serves the previewed product's icon on a preview host", () => {
    const response = middleware(
      faviconRequest("ssw-products-git-some-branch-tinacms.vercel.app", "Tiger")
    );

    expect(rewrittenPath(response)).toBe("/favicons/Tiger.ico");
  });

  it("leaves an unknown host alone", () => {
    expect(rewrittenPath(middleware(faviconRequest("example.com")))).toBeNull();
  });
});
