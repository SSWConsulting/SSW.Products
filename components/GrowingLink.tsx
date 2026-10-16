import { cn } from "@/lib/utils";
import { Modify } from "@/types/modify";
import Link, { LinkProps } from "next/link";
import React from "react";

// Animated underline that grows from the right on hover. Active items keep it
// shown by passing `after:scale-x-100 after:origin-left`.
//
// Colour follows the nav rule: white while shown for an active item, red on
// hover. `after:bottom-1.5` sits the underline close under the text.
const growingLinkClasses =
  "w-fit relative text-nowrap after:absolute after:left-0 after:bottom-1.5 after:h-0.25 after:w-full after:origin-right after:scale-x-0 after:bg-white after:transition-transform after:duration-200 after:ease-in-out hover:after:origin-left hover:after:scale-x-100 hover:after:bg-ssw-red";

type GrowingLinkProps = Modify<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  LinkProps
>;

const GrowingLink = ({ className, ...props }: GrowingLinkProps) => {
  return <Link className={cn(growingLinkClasses, className)} {...props} />;
};

export default GrowingLink;
