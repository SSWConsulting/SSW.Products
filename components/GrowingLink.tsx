import { cn } from "@/lib/utils";
import { Modify } from "@/types/modify";
import Link, { LinkProps } from "next/link";
import React from "react";

// Shared underline geometry so the nav links and the dropdown trigger
// (SubGroup) stay in sync on offset, thickness, hidden state and timing.
export const underlineBase =
  "after:absolute after:bottom-1.5 after:h-0.25 after:scale-x-0 after:transition-transform after:duration-200 after:ease-in-out";

// Animated underline that grows from the left on hover. Active items keep it
// shown by passing `after:scale-x-100 after:origin-left after:bg-ssw-red`.
//
// Colour follows the nav rule: red while shown for an active item, white on
// hover — and white at rest, so it shrinks away white instead of flashing red
// on hover-out. `after:bottom-1.5` sits the underline close under the text.
const growingLinkClasses = cn(
  "w-fit relative text-nowrap",
  underlineBase,
  "after:left-0 after:w-full after:origin-right after:bg-white hover:after:origin-left hover:after:scale-x-100 hover:after:bg-white"
);

type GrowingLinkProps = Modify<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  LinkProps
>;

const GrowingLink = ({ className, ...props }: GrowingLinkProps) => {
  return <Link className={cn(growingLinkClasses, className)} {...props} />;
};

export default GrowingLink;
