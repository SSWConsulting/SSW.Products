import { TigerBackground } from "./TigerBackground";

export default function ProductBackground({ product }: { product: string }) {
  if (product === "Tiger") return <TigerBackground />;
  return null;
}
