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
        "whitespace-nowrap inline-flex items-center rounded-lg transition-all duration-200 font-semibold uppercase",
        className
      )}
      target="_blank"
    >
      {action.icon && (
        <div className="relative size-5 mr-2">
          <Image src={action.icon} alt={action.label} fill />
        </div>
      )}
      {action.label}
    </Link>
  );
};

const Actions = ({ actions, className }: ActionsProps) => {
  return (
    <div className="grid">
      {actions &&
        actions.map((action, index) => (
          <div key={index}>
            <ActionButton action={action} className={className} />
          </div>
        ))}
    </div>
  );
};

export default Actions;
