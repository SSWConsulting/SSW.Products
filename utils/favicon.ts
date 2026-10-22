import EagleEyeIcon from "../public/favicons/EagleEye.ico";
import TigerIcon from "../public/favicons/Tiger.ico";
import TimeProIcon from "../public/favicons/TimePro.ico";
import YakShaverIcon from "../public/favicons/YakShaver.ico";
import { withAssetVersion } from "./assetVersion";

// The icons still live in public/, but they are imported so Next also emits
// them under /_next/static/media/. sswtimepro.com is a WP Engine site where
// Cloudflare only proxies /docs* and /_next/* through to this app, so a plain
// /favicons/TimePro.ico href resolves against WP Engine and 404s. /_next/* is
// proxied, and the emitted filename is content-hashed, so it is cache-busted
// without withAssetVersion.
const PRODUCT_FAVICONS: Record<string, { src: string }> = {
  EagleEye: EagleEyeIcon,
  Tiger: TigerIcon,
  TimePro: TimeProIcon,
  YakShaver: YakShaverIcon,
};

// Falls back to the public path for any product added to NEXT_PUBLIC_PRODUCT_LIST
// before its icon is registered here.
export function getFaviconHref(product: string): string {
  return (
    PRODUCT_FAVICONS[product]?.src ?? withAssetVersion(`/favicons/${product}.ico`)
  );
}
