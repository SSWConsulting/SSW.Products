import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const { pathname } = request.nextUrl;

  const isLocal = hostname?.includes('localhost') || hostname?.includes('127.0.0.1');
  const productList = process.env.NEXT_PUBLIC_PRODUCT_LIST ? JSON.parse(process.env.NEXT_PUBLIC_PRODUCT_LIST) : [];

  const pathSegments = pathname.split('/').filter(segment => segment.length > 0);

  // Explicitly allow access to YakShaver's .well-known JSON file
  if (hostname === 'www.yakshaver.ai' && pathname === '/.well-known/microsoft-identity-association.json') {
    return NextResponse.next();
  }

  // Allow TinaCMS admin paths to be handled without rewriting
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (isLocal) {
    return handleLocalRequest(pathSegments, productList, request);
  } else {
    return handleProductionRequest(hostname, productList, pathname, request);
  }
}

function handleLocalRequest(pathSegments: string[], productList: any[], request: NextRequest) {
  const isProduct = productList.some(product => product.product === pathSegments[0]);

  if (isProduct) {
    const rewriteUrl = new URL(`/${pathSegments.join('/')}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  } else {
    const rewriteUrl = new URL(`/${process.env.DEFAULT_PRODUCT}${request.nextUrl.pathname}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }
}

function handleProductionRequest(hostname: string | null, productList: any[], pathname: string, request: NextRequest) {
  for (const product of productList) {
    if (hostname === product.domain) {
      const rewriteUrl = new URL(`/${product.product}${pathname}`, request.url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }
  return NextResponse.next();
}

// Middleware config to exclude static and other paths
export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|.*\\..*).*)',
  ],
};
