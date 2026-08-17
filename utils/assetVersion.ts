const ASSET_VERSION =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ??
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 8);

export function withAssetVersion(src: string): string {
  if (!ASSET_VERSION || !src.startsWith("/")) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${ASSET_VERSION}`;
}
