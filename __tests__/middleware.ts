import { NextRequest } from "next/server";
import { middleware } from "../middleware";

const productList = [
  { product: "YakShaver", domain: "yakshaver.ai" },
  { product: "TimePro", domain: "sswtimepro.com" },
];

describe("download redirect", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PRODUCT_LIST = JSON.stringify(productList);
    process.env.DEFAULT_PRODUCT = "YakShaver";
  });

  it("redirects the YakShaver download URL to install", () => {
    const response = middleware(
      new NextRequest("https://yakshaver.ai/download", {
        headers: { host: "yakshaver.ai" },
      }),
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://yakshaver.ai/install",
    );
  });

  it("does not redirect another product's download URL", () => {
    const response = middleware(
      new NextRequest("https://sswtimepro.com/download", {
        headers: { host: "sswtimepro.com" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://sswtimepro.com/TimePro/download",
    );
  });

  it("redirects the YakShaver download URL on a preview deployment", () => {
    const response = middleware(
      new NextRequest(
        "https://ssw-products-git-install-yakshaver-tinacms.vercel.app/download",
        {
          headers: {
            host: "ssw-products-git-install-yakshaver-tinacms.vercel.app",
          },
        },
      ),
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://ssw-products-git-install-yakshaver-tinacms.vercel.app/install",
    );
  });

  it("does not redirect another product on a preview deployment", () => {
    process.env.DEFAULT_PRODUCT = "TimePro";

    const response = middleware(
      new NextRequest("https://ssw-products-timepro.vercel.app/download", {
        headers: { host: "ssw-products-timepro.vercel.app" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://ssw-products-timepro.vercel.app/TimePro/download",
    );
  });
});
