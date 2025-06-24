import { GridPattern } from "@/components/magicui/grid-background";

const GridBackground = () => {
  return (
    <GridPattern
      stroke="2rem"
      className="mask-[radial-gradient(400px_circle_at_center,white,transparent)]"
      strokeDasharray={"4 2"}
      width={30}
      height={30}
    />
  );
};

export default GridBackground;
