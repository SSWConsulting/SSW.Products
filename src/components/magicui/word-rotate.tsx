"use client";

import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
  gradientClasses?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
  gradientClasses = "bg-linear-to-br from-[#e34f4f] from-30% via-[#D699FB] via-80% to-[#FF778E]  bg-clip-text text-transparent",
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words === null) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  if (words === null) return null;

  return (
    // span, not h1: the rotating word is part of its parent heading, not a
    // heading of its own. inline-block keeps the enter/exit y-transform working.
    <span className="inline-block overflow-hidden py-2 align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={cn("inline-block", className, gradientClasses)}
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
