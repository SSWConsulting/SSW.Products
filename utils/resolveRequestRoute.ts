import type { Locale } from "@utils/localeFromBreadcrumbs";

export interface ProductEntry { product: string; domain: string; }
export interface ResolveInput {
  hostname: string | null;
  pathname: string;
  productList: ProductEntry[];
  env: { defaultProduct: string };
}
export interface ResolvedRoute { locale: Locale; product: string; internalPath: string; }

function isChineseDomain(hostname: string): boolean {
  return (
    hostname === "yakshaver.cn" ||
    hostname.endsWith(".yakshaver.cn") ||
    hostname === "yakshaver.com.cn" ||
    hostname.endsWith(".yakshaver.com.cn")
  );
}
function splitLocaleFromPath(pathname: string): { locale: Locale; rest: string } {
  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    return { locale: "zh", rest: pathname.slice(3) || "" };
  }
  return { locale: "en", rest: pathname };
}
function segments(path: string): string[] {
  return path.split("/").filter((s) => s.length > 0);
}

// `internalPath` targets the app/[locale]/[product]/... route tree introduced
// in the same change set; middleware.ts rewrites to it. Public URLs are
// unchanged (rewrite, not redirect) — locale is invisible to clients.
export function resolveRequestRoute(input: ResolveInput): ResolvedRoute | null {
  const { hostname, pathname, productList, env } = input;
  if (!hostname) return null;
  const isLocal = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const isStaging = hostname.includes("vercel.app");

  if (!isLocal && !isStaging && isChineseDomain(hostname)) {
    const { rest } = splitLocaleFromPath(pathname);
    return { locale: "zh", product: "YakShaver", internalPath: buildPath("zh", "YakShaver", rest, productList) };
  }
  const { locale, rest } = splitLocaleFromPath(pathname);
  let product: string | null = null;
  if (isLocal || isStaging) {
    const seg = segments(rest);
    product = productList.some((p) => p.product === seg[0]) ? seg[0] : env.defaultProduct;
  } else {
    product = productList.find((p) => p.domain === hostname)?.product ?? null;
  }
  if (!product) return null;
  return { locale, product, internalPath: buildPath(locale, product, rest, productList) };
}

function buildPath(locale: Locale, product: string, rest: string, productList: ProductEntry[]): string {
  const seg = segments(rest);
  const alreadyHasProduct = productList.some((p) => p.product === seg[0]);
  if (alreadyHasProduct) {
    // rest already starts with the product name; just prefix locale
    const restPath = seg.length > 1 ? `/${seg.join("/")}` : `/${seg[0]}`;
    return `/${locale}${restPath}`;
  }
  // rest is something like "/blog" or "/" or ""
  // strip trailing slash from rest to avoid "/en/YakShaver/"
  const cleanRest = rest === "/" ? "" : rest.replace(/\/$/, "");
  return `/${locale}/${product}${cleanRest}`;
}
