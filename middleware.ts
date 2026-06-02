import { NextRequest, NextResponse } from "next/server";
import { resolveRequestRoute, type ProductEntry } from "@utils/resolveRequestRoute";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("x-original-host") || request.headers.get("host");
  const { pathname } = request.nextUrl;

  // Bypass rewriting for these paths.
  if (pathname.startsWith("/.well-known") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const productList: ProductEntry[] = process.env.NEXT_PUBLIC_PRODUCT_LIST
    ? JSON.parse(process.env.NEXT_PUBLIC_PRODUCT_LIST)
    : [];

  const resolved = resolveRequestRoute({
    hostname,
    pathname,
    productList,
    env: { defaultProduct: process.env.DEFAULT_PRODUCT || "YakShaver" },
  });

  if (!resolved) {
    return NextResponse.next();
  }

  const rewriteUrl = new URL(resolved.internalPath, request.url);
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)", "/sitemap.xml"],
};
