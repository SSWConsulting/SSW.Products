import { cn } from "@/lib/utils";
import { Modify } from "@/types/modify";
import { cva, VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import React from "react";

const growingLinkClasses = cva(
  "w-fit after:border-b relative text-nowrap after:duration-200 after:inset-x-0 hover:after:scale-x-100 after:transition-transform after:ease-in-out after:absolute after:inset-y-0.5 hover:after:origin-left after:origin-right after:scale-x-0",
  {
    variants: {
      underlineColor: {
        red: "after:border-ssw-red",
        white: "after:border-white",
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
            className={cn(growingLinkClasses({underlineColor}), className)} 
            {...props} />
    )
}

export default GrowingLink;