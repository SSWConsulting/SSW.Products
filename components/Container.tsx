import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  size?: "small" | "medium";
};

const sizeClasses = {
  small: "max-w-[43.75rem]",
  medium: "max-w-[75rem]",
};

const Container = ({ children, size = "medium" }: ContainerProps) => {
  return (
    <section
      className={cn(
        "px-4 sm:px-8 mx-auto md:px-12 max-w-[75rem]",
        sizeClasses[size]
      )}
    >
      {children}
    </section>
  );
};

export default Container;
