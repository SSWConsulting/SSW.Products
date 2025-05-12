import { cn } from "@/lib/utils";
import React, { ElementType } from "react";
type InputProps = {
  placeholder: string;
  icon?: ElementType;
  className?: string;
};

const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ placeholder, icon: Icon, className, ...props }, forwardRef) => {
    return (
      <div {...props} ref={forwardRef} className={cn("relative", className)}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-2 px-4 pl-12 placeholder:text-gray-300 focus:outline-none"
        />
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
