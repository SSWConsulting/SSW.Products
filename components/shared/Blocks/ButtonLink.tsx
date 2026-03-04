import { useContextualLink } from "@utils/contextualLink";
import { ButtonSize, ButtonVariant } from "./buttonEnum";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { variantMap } from "./BookingButton";
import { sizeMap } from "./ActionsButton";

export type ButtonLink = {
  label: string;
  url: string;
  icon?: string | null;
  iconPosition?: string | null;
variant: ButtonVariant;
    size: ButtonSize;
};

export type ButtonLinksProps = {
  buttons: ButtonLink[];
  className?: string;
};

export const ButtonLink = ({ button, className }: { button: ButtonLink, className?: string }) => {

    const contextualHref = useContextualLink();
  
  if (!button.url) return null;
  
  return (
    <Link
      href={contextualHref(button.url)}
      className={cn(
        variantMap[button.variant],
        sizeMap[button.size],
        "whitespace-nowrap inline-flex items-center gap-2 rounded-lg transition-all duration-200 font-semibold uppercase",
        button.iconPosition === "left" ? "flex-row-reverse" : "flex-row",
        className
      )}
      target="_blank"
    >
        {button.label}
        {button.icon && (
            <div className="relative size-5">
            <Image fill src={button.icon} alt={button.label || "Icon"} />
            </div>
        )}
    </Link>
  );
}

export const ButtonLinks = ({ buttons, className }: ButtonLinksProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
        {buttons && buttons.map((button, i) => {
        return (
            <ButtonLink
                key={i}
                button={button}
                className={cn("flex-1 justify-center", className)}
            />
        );
        })}
    </div>
  );
};
