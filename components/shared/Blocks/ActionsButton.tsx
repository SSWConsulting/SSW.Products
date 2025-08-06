import { cn } from "@/lib/utils";
import Link from "next/link";
import { variantMap } from "./BookingButton";
import { ButtonSize, ButtonVariant } from "./buttonEnum";

type ActionButton = {
  label: string;
  url: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
};

type ActionsProps = {
  actions: ActionButton[];
  className?: string;
};

const sizeMap = {
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
  return action.url ? (
    <Link
      href={action.url}
      className={cn(
        variantMap[action.variant],
        className,
        sizeMap[action.size],
        `whitespace-nowrap inline-flex items-center justify-center rounded-lg transition-all duration-200 font-semibold uppercase`,
        action.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:opacity-80"
      )}
      target="_blank"
    >
      {action.label}
    </Link>
  ) : null;
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
