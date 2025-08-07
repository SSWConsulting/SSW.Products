import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const { pathname } = request.nextUrl;

  const isLocal =
    hostname?.includes("localhost") || hostname?.includes("127.0.0.1");
  const isStaging = hostname?.includes("vercel.app");
  const productList = process.env.NEXT_PUBLIC_PRODUCT_LIST
    ? JSON.parse(process.env.NEXT_PUBLIC_PRODUCT_LIST)
    : [];

  // Allow .well-known paths without rewriting
  if (pathname.startsWith("/.well-known")) {
    return NextResponse.next(); // Bypass rewriting for these paths
  }

  // Allow TinaCMS admin paths
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isLocal || isStaging) {
    return handleLocalRequest(pathname, productList, request);
  } else {
    return handleProductionRequest(hostname, productList, pathname, request);
  }
}

function handleLocalRequest(
  pathname: string,
  productList: any[],
  request: NextRequest
) {
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);
  const isProduct = productList.some(
    (product) => product.product === pathSegments[0]
  );

  const language = pathname.startsWith('/zh') ? 'zh' : 'en';

  if (isProduct) {
    const rewriteUrl = new URL(`/${pathSegments.join("/")}`, request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-language', language);
    return response;
  } else {
    const cleanPath = pathname.startsWith('/zh') ? pathname.substring(3) : pathname;
    const rewriteUrl = new URL(
      `/${process.env.DEFAULT_PRODUCT}${cleanPath}`,
      request.url
    );
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-language', language);
    return response;
  }
}

function handleProductionRequest(
  hostname: string | null,
  productList: any[],
  pathname: string,
  request: NextRequest
) {
  const language = pathname.startsWith('/zh') ? 'zh' : 'en';

  for (const product of productList) {
    if (hostname === product.domain) {
      const cleanPath = pathname.startsWith('/zh') ? pathname.substring(3) : pathname;
      const rewriteUrl = new URL(`/${product.product}${cleanPath}`, request.url);
      const response = NextResponse.rewrite(rewriteUrl);
      response.headers.set('x-language', language);
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)", "/sitemap.xml"],
};
