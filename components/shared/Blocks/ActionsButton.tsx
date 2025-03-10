import React from "react";
import Link from "next/link";
import { ButtonSize, ButtonVariant } from "./buttonEnum";

type ActionButton = {
  label: string;
  url: string;
  variant: ButtonVariant;
  size: ButtonSize;
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
  return action.url ? (
    <Link
      href={action.url}
      className={`whitespace-nowrap inline-flex items-center justify-center rounded-lg ${className} ${action.variant} ${action.size} hover:opacity-80 transition-opacity duration-200 font-semibold`}
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
