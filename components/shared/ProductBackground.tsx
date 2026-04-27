import { TigerBackground } from "./Blocks/Hero/TigerBackground";

export default function ProductBackground({ product }: { product: string }) {
  if (product === "Tiger") return <TigerBackground />;
  return null;
}
