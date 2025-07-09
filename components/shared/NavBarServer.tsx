import { NavGroup } from "@/types/nav-group";
import { NavigationBarLeftNavItemStringItem as NavItem } from "@tina/__generated__/types";
import client from "../../tina/__generated__/client";
import NavBarClient from "./NavBarClient";

interface NavBarServerProps {
  product: string;
}

export default async function NavBarServer({ product }: NavBarServerProps) {
  const { data } = await client.queries.navigationBar({
    relativePath: `${product}/${product}-NavigationBar.json`,
  });
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
  const { imgSrc, imgHeight, imgWidth } = data.navigationBar || {};
  const bannerImage =
    imgSrc && imgHeight && imgWidth
      ? { imgHeight, imgSrc, imgWidth }
      : undefined;
  return (
    <NavBarClient bannerImage={bannerImage} buttons={buttons} items={items} />
  );
}
