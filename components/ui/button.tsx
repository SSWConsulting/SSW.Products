import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// The site's button standard. The first 3 variants and the sizes are the
// styles editors pick in the CMS (see `ButtonVariant` and `ButtonSize`), so
// their keys must match the values stored in content.
// Every variant has a 1px border (transparent on the solid ones) so they're
// all the same height side by side, and hover only changes the background so
// the label never fades.
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-semibold uppercase ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solidRed: "border-transparent bg-ssw-red text-white hover:bg-ssw-red/80",
        solidWhite: "border-transparent bg-white text-black hover:bg-white/80",
        outlinedWhite: "border-white text-white hover:bg-white/20",
        // Not CMS styles: the blog's "Load All" button and category filters
        secondary:
          "border-transparent bg-ssw-charcoal text-white hover:bg-white hover:text-black",
        ghost: "border-transparent hover:text-ssw-red",
      },
      size: {
        small: "h-9 px-3 text-sm",
        medium: "h-10 px-4 text-base",
        large: "h-13 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "solidRed",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, variant, size, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
