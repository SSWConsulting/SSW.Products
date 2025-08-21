import { NextRequest, NextResponse } from "next/server";

function detectLanguage(pathname: string): string {
  return pathname.startsWith('/zh') ? 'zh' : 'en';
}

function cleanPathFromLanguage(pathname: string): string {
  return pathname.startsWith('/zh') ? pathname.substring(3) : pathname;
}

function parsePathSegments(pathname: string): string[] {
  return pathname
    .split("/")
    .filter((segment) => segment.length > 0);
}

function createRewriteResponse(targetPath: string, language: string, request: NextRequest): NextResponse {
  const rewriteUrl = new URL(targetPath, request.url);
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set('x-language', language);
  return response;
}

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

  const language = detectLanguage(pathname);

  if (isLocal || isStaging) {
    return handleLocalRequest(pathname, productList, request, language);
  } else {
    return handleProductionRequest(hostname, productList, pathname, request, language);
  }
}

function handleLocalRequest(
  pathname: string,
  productList: any[],
  request: NextRequest,
  language: string
) {
  const pathSegments = parsePathSegments(pathname);
  const isProduct = productList.some(
    (product) => product.product === pathSegments[0]
  );

  if (isProduct) {
    return createRewriteResponse(`/${pathSegments.join("/")}`, language, request);
  } else {
    const cleanPath = cleanPathFromLanguage(pathname);
    return createRewriteResponse(
      `/${process.env.DEFAULT_PRODUCT}${cleanPath}`,
      language,
      request
    );
  }
}

function handleProductionRequest(
  hostname: string | null,
  productList: any[],
  pathname: string,
  request: NextRequest,
  language: string
) {
  const isChineseDomain = hostname?.endsWith('yakshaver.cn') || hostname?.endsWith('yakshaver.com.cn');
  
  if (isChineseDomain) {
    return createRewriteResponse(`/YakShaver/zh${pathname}`, 'zh', request);
  }
  
  for (const product of productList) {
    if (hostname === product.domain) {
      const cleanPath = cleanPathFromLanguage(pathname);
      return createRewriteResponse(`/${product.product}${cleanPath}`, language, request);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)", "/sitemap.xml"],
};
