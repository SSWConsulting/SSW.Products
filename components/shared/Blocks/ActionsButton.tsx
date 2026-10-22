import { cn } from "@/lib/utils";
import Link from "next/link";
import { useContextualLink } from "@utils/contextualLink";
import { variantMap } from "./BookingButton";
import { ButtonSize, ButtonVariant } from "./buttonEnum";
import Image from "next/image";

export type ActionButton = {
  label: string;
  url: string;
  variant: ButtonVariant;
  size: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
};

type ActionsProps = {
  actions: ActionButton[];
  className?: string;
};

export const sizeMap = {
  small: "py-1 px-2 text-sm",
  medium: "py-2 px-4 text-base",
  large: "py-3 text-lg px-6 text-lg",
};

export const ActionButton = ({
  action,
  className,
}: {
  action: ActionButton;
  className?: string;
}) => {
  const contextualHref = useContextualLink();

  if (!action.url) return null;

  return (
    <Link
      href={contextualHref(action.url)}
      className={cn(
        variantMap[action.variant],
        sizeMap[action.size],
        "whitespace-nowrap inline-flex items-center gap-2 rounded-lg transition-all duration-200 font-semibold uppercase",
        action.iconPosition === "left" ? "flex-row-reverse" : "flex-row",
        className
      )}
      target="_blank"
    >
      {action.label}
      {action.icon && (
        <div className="relative size-5">
          <Image fill src={action.icon} alt={action.label || "Icon"} />
        </div>
      )}
    </Link>
  );
};

const Actions = ({ actions, className }: ActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      {actions &&
        actions.map((action, index) => (
          <div key={index}>
            <ActionButton
              action={action}
              className={cn(className, "flex-1 justify-center")}
            />
          </div>
        ))}
    </div>
  );
};

export default Actions;
