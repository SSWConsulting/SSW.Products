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
  const response = NextResponse.rewrite(rewriteUrl);
  // Kept for backwards-compat while pages migrate from getLocale() to params.
  // Removed in a later cleanup task once nothing reads it.
  response.headers.set("x-language", resolved.locale);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)", "/sitemap.xml"],
};
