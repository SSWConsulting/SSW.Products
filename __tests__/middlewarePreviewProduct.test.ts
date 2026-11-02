import { NextRequest } from "next/server";
import { middleware, PREVIEW_PRODUCT_COOKIE } from "../middleware";

const productList = [
  { product: "YakShaver", domain: "yakshaver.ai" },
  { product: "Tiger", domain: "tiger.example.com" },
  { product: "EagleEye", domain: "eagleeye.example.com" },
];

const previewHost = "ssw-products-git-some-branch-tinacms.vercel.app";

function previewRequest(path: string, cookie?: string) {
  const headers: Record<string, string> = { host: previewHost };
  if (cookie !== undefined) {
    headers.cookie = `${PREVIEW_PRODUCT_COOKIE}=${cookie}`;
  }
  return new NextRequest(`https://${previewHost}${path}`, { headers });
}

function rewrittenPath(response: Response) {
  const rewrite = response.headers.get("x-middleware-rewrite");
  return rewrite ? new URL(rewrite).pathname : null;
}

function previewCookie(response: Response) {
  return (response as any).cookies.get(PREVIEW_PRODUCT_COOKIE);
}

describe("preview product switch", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PRODUCT_LIST = JSON.stringify(productList);
    process.env.DEFAULT_PRODUCT = "YakShaver";
  });

  it("serves the default product on a bare path with no cookie", () => {
    const response = middleware(previewRequest("/docs"));

    expect(rewrittenPath(response)).toBe("/YakShaver/docs");
    expect(previewCookie(response)).toBeUndefined();
  });

  it("rewrites to the ?product= product and remembers it in a cookie", () => {
    const response = middleware(previewRequest("/?product=Tiger"));

    expect(rewrittenPath(response)).toBe("/Tiger/");
    expect(previewCookie(response)).toMatchObject({
      value: "Tiger",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  });

  it("matches ?product= case-insensitively", () => {
    const response = middleware(previewRequest("/docs?product=tiger"));

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
    expect(previewCookie(response)?.value).toBe("Tiger");
  });

  it("uses the cookie's product for bare paths", () => {
    const response = middleware(previewRequest("/docs", "Tiger"));

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
  });

  it("keeps the language prefix handling with the cookie's product", () => {
    const response = middleware(previewRequest("/zh/docs", "Tiger"));

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
    expect(response.headers.get("x-language")).toBe("zh");
  });

  it("lets a product path segment override the cookie and remembers it", () => {
    const response = middleware(previewRequest("/EagleEye/docs", "Tiger"));

    expect(rewrittenPath(response)).toBe("/EagleEye/docs");
    expect(previewCookie(response)?.value).toBe("EagleEye");
  });

  it("matches a product path segment case-insensitively", () => {
    const response = middleware(previewRequest("/tiger/docs"));

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
    expect(previewCookie(response)?.value).toBe("Tiger");
  });

  it("ignores an unknown ?product= value", () => {
    const response = middleware(previewRequest("/docs?product=Nope", "Tiger"));

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
    expect(previewCookie(response)).toBeUndefined();
  });

  it("ignores an unknown cookie value", () => {
    const response = middleware(previewRequest("/docs", "../../admin"));

    expect(rewrittenPath(response)).toBe("/YakShaver/docs");
  });

  it.each(["/?product=", "/?product=default", "/?product=Default"])(
    "%s clears the cookie and serves the default product",
    (path) => {
      const response = middleware(previewRequest(path, "Tiger"));

      expect(rewrittenPath(response)).toBe("/YakShaver/");
      expect(previewCookie(response)).toMatchObject({ value: "", path: "/" });
      expect(response.headers.get("set-cookie")).toMatch(
        /preview-product=;.*Expires=Thu, 01 Jan 1970/,
      );
    },
  );

  it("works the same on localhost", () => {
    const response = middleware(
      new NextRequest("http://localhost:3000/docs?product=Tiger", {
        headers: { host: "localhost:3000" },
      }),
    );

    expect(rewrittenPath(response)).toBe("/Tiger/docs");
    expect(previewCookie(response)).toMatchObject({
      value: "Tiger",
      secure: false,
    });
  });
});

describe("preview product switch on production hosts", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PRODUCT_LIST = JSON.stringify(productList);
    process.env.DEFAULT_PRODUCT = "YakShaver";
  });

  it("ignores ?product= and the cookie and serves the host's product", () => {
    const response = middleware(
      new NextRequest("https://yakshaver.ai/docs?product=Tiger", {
        headers: {
          host: "yakshaver.ai",
          cookie: `${PREVIEW_PRODUCT_COOKIE}=EagleEye`,
        },
      }),
    );

    expect(rewrittenPath(response)).toBe("/YakShaver/docs");
    expect(previewCookie(response)).toBeUndefined();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("does not clear the cookie on ?product=default", () => {
    const response = middleware(
      new NextRequest("https://tiger.example.com/?product=default", {
        headers: {
          host: "tiger.example.com",
          cookie: `${PREVIEW_PRODUCT_COOKIE}=EagleEye`,
        },
      }),
    );

    expect(rewrittenPath(response)).toBe("/Tiger/");
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
