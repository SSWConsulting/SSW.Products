import { cn } from "@/lib/utils";
import { ElementType } from "react";
type InputProps = {
  placeholder: string;
  icon?: ElementType; // Optional icon prop
  className?: string; // Optional className props
};

const Input = ({ placeholder, icon: Icon, className }: InputProps) => {
  const setSearchTerm = (val: string) => {
    console.log(val);
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-2 px-4 pl-12 placeholder:text-gray-300 focus:outline-none"
      />
      {Icon && (
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
      )}
      {/* TODO: Add an optional icon prop */}
      {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" /> */}
    </div>
  );
};

export default Input;
