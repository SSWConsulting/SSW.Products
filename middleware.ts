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

function createYakShaverDownloadRedirect(
  targetProduct: string | null | undefined,
  pathname: string,
  request: NextRequest
): NextResponse | null {
  if (targetProduct !== "YakShaver" || pathname !== "/download") {
    return null;
  }

  return NextResponse.redirect(new URL("/install", request.url), 308);
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("x-original-host") || request.headers.get("host");
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

  const isChineseDomain = !!(hostname?.endsWith('yakshaver.cn') || hostname?.endsWith('yakshaver.com.cn'));
  const language = isChineseDomain ? 'zh' : detectLanguage(pathname);

  if (isLocal || isStaging) {
    return handleLocalRequest(pathname, productList, request, language);
  } else {
    return handleProductionRequest(hostname, productList, pathname, request, language, isChineseDomain);
  }
}

// Preview and local hosts serve every product from one URL. The product is
// picked from ?product=, then the first path segment, then this cookie, so a
// reviewer who opens /?product=Tiger stays on Tiger when they click /docs.
export const PREVIEW_PRODUCT_COOKIE = "preview-product";
const PREVIEW_PRODUCT_PARAM = "product";
const PREVIEW_PRODUCT_RESET = "default";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

// The product's name as the product list spells it, or undefined when the
// value is not a known product. Case-insensitive, so "tiger" finds "Tiger".
function findProduct(
  value: string | null | undefined,
  productList: any[]
): string | undefined {
  if (!value) {
    return undefined;
  }

  const wanted = value.toLowerCase();
  return productList.find(
    (product) =>
      typeof product?.product === "string" &&
      product.product.toLowerCase() === wanted
  )?.product;
}

function handleLocalRequest(
  pathname: string,
  productList: any[],
  request: NextRequest,
  language: string
) {
  const pathSegments = parsePathSegments(pathname);
  const pathProduct = findProduct(pathSegments[0], productList);

  // ?product= (empty) or ?product=default forgets the remembered product.
  const queryValue = request.nextUrl.searchParams.get(PREVIEW_PRODUCT_PARAM);
  const isReset =
    queryValue !== null &&
    (queryValue === "" || queryValue.toLowerCase() === PREVIEW_PRODUCT_RESET);
  const queryProduct = isReset ? undefined : findProduct(queryValue, productList);
  const cookieProduct = isReset
    ? undefined
    : findProduct(request.cookies.get(PREVIEW_PRODUCT_COOKIE)?.value, productList);

  const targetProduct =
    pathProduct ?? queryProduct ?? cookieProduct ?? process.env.DEFAULT_PRODUCT;
  const downloadRedirect = createYakShaverDownloadRedirect(
    targetProduct,
    pathname,
    request
  );

  let response: NextResponse;
  if (downloadRedirect) {
    response = downloadRedirect;
  } else if (pathProduct) {
    const productPath = [pathProduct, ...pathSegments.slice(1)].join("/");
    response = createRewriteResponse(`/${productPath}`, language, request);
  } else {
    const cleanPath = cleanPathFromLanguage(pathname);
    response = createRewriteResponse(
      `/${targetProduct}${cleanPath}`,
      language,
      request
    );
  }

  const productToRemember = queryProduct ?? pathProduct;
  if (isReset) {
    response.cookies.delete({ name: PREVIEW_PRODUCT_COOKIE, path: "/" });
  } else if (productToRemember && productToRemember !== cookieProduct) {
    response.cookies.set(PREVIEW_PRODUCT_COOKIE, productToRemember, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      maxAge: ONE_DAY_IN_SECONDS,
    });
  }

  return response;
}

function handleProductionRequest(
  hostname: string | null,
  productList: any[],
  pathname: string,
  request: NextRequest,
  language: string,
  isChineseDomain: boolean
) {
  let targetProduct: string | null = null;
  
  if (isChineseDomain) {
    targetProduct = 'YakShaver';
  } else {
    for (const product of productList) {
      if (hostname === product.domain) {
        targetProduct = product.product;
        break;
      }
    }
  }
  
  if (targetProduct) {
    const downloadRedirect = createYakShaverDownloadRedirect(
      targetProduct,
      pathname,
      request
    );

    if (downloadRedirect) {
      return downloadRedirect;
    }

    const cleanPath = cleanPathFromLanguage(pathname);
    const pathSegments = parsePathSegments(cleanPath);
    const pathAlreadyHasProduct = productList.some(
      (product: any) => product.product === pathSegments[0]
    );

    if (pathAlreadyHasProduct) {
      return createRewriteResponse(`/${pathSegments.join("/")}`, language, request);
    }

    return createRewriteResponse(`/${targetProduct}${cleanPath}`, language, request);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)", "/sitemap.xml"],
};
