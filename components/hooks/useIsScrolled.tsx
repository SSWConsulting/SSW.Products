import { useMotionValueEvent, useScroll } from "motion/react";

import { useState } from "react";

const useIsScrolled = () => {
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return { scrolled };
};

export default useIsScrolled;
