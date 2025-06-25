import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  size?: "small" | "medium";
  className?: string;
  "data-tina-field"?: string;
};

const sizeClasses = {
  small: "max-w-175 small:px-0",
  medium: "max-w-300 md:px-12 sm:px-8 medium:px-0",
};

const Container = ({
  children,
  size = "medium",
  className,
  ...props
}: ContainerProps) => {
  return (
    <section
      data-tina-field={props["data-tina-field"]}
      className={cn("px-4 mx-auto", sizeClasses[size], className)}
    >
      {children}
    </section>
  );
};

export default Container;
