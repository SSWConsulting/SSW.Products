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
    data.navigationBar.leftNavItem?.filter((item) => item !== null) || [];
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
