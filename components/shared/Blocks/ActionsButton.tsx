import { buttonVariants } from "@comps/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useContextualLink } from "@utils/contextualLink";
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
        buttonVariants({ variant: action.variant, size: action.size }),
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
