import { cn } from "@/lib/utils";
import { Modify } from "@/types/modify";
import { cva, VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import React from "react";

const growingLinkClasses = cva(
  "w-fit after:h-0.25 after:bottom-0.5 after:left-0 after:w-full relative text-nowrap after:duration-200 hover:after:scale-x-100 after:transition-transform after:ease-in-out after:absolute hover:after:origin-left after:origin-right after:scale-x-0",
  {
    variants: {
      underlineColor: {
        red: "after:bg-ssw-red",
        white: "bg:bg-white",
      },
    },
    defaultVariants: {
      underlineColor: "white",
    },
  }
);

type GrowingLinkVariants = VariantProps<typeof growingLinkClasses>;

type GrowingLinkProps = Modify<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    LinkProps
    > & GrowingLinkVariants;

const GrowingLink = ({className, underlineColor,  ...props}: GrowingLinkProps) => {
    return (
        <Link 
            className={cn(growingLinkClasses({underlineColor}), className, "after:h-1px]")} 
            {...props} />
    )
}

export default GrowingLink;