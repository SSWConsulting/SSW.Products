import { NavGroup } from "@/types/nav-group";
import { NavigationBarLeftNavItemStringItem as NavItem } from "@tina/__generated__/types";
import { withAssetVersion } from "@utils/assetVersion";
import { getHostname, getNavigationBarWithFallback } from "@utils/i18n";
import NavBarClient from "./NavBarClient";

interface NavBarServerProps {
  product: string;
  locale?: string;
}

export default async function NavBarServer({ product, locale }: NavBarServerProps) {
  const result = await getNavigationBarWithFallback(product, locale);
  // Strip any port so this matches window.location.hostname after hydration.
  const hostname = (await getHostname()).split(":")[0];

  if (!result?.data) {
    return null;
  }
  
  const { data } = result;
  const items =
    data.navigationBar.leftNavItem?.reduce<(NavGroup | NavItem)[]>(
      (acc, item) => {
        if (item === null || item === undefined) {
          return acc;
        }

        if (item.__typename === "NavigationBarLeftNavItemStringItem") {
          return [...acc, item];
        }

        if (item.__typename === "NavigationBarLeftNavItemGroupOfStringItems") {
          const filtered = item.items?.filter(
            (subItem) => subItem !== null && subItem !== undefined
          );
          return [
            ...acc,
            {
              ...item,
              items: filtered || [],
            },
          ];
        }

        return acc;
      },
      []
    ) || [];

  const buttons =
    data.navigationBar.buttons?.filter((button) => button !== null) || [];
  const { imgSrc, imgHeight, imgWidth, showLanguageToggle } =
    data.navigationBar || {};

  const normalizedImgSrc = (() => {
    if (product !== "YakShaver" || typeof imgSrc !== "string") {
      return imgSrc;
    }
    if (!imgSrc.includes("assets.tina.io")) {
      return imgSrc;
    }
    try {
      const url = new URL(imgSrc);
      if (url.pathname.includes("yakshaver-logo.png")) {
        return "/yakshaver-logo.png";
      }
    } catch {
      // Ignore URL parsing errors
    }
    return imgSrc;
  })();

  const bannerImage =
    normalizedImgSrc && imgHeight && imgWidth
      ? { imgHeight, imgSrc: withAssetVersion(normalizedImgSrc), imgWidth }
      : undefined;
  return (
    <NavBarClient
      bannerImage={bannerImage}
      buttons={buttons}
      items={items}
      currentLocale={locale || 'en'}
      hostname={hostname}
      showLanguageToggle={showLanguageToggle ?? false}
    />
  );
}
