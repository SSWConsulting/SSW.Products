import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { FaChevronRight } from "react-icons/fa";
const SubGroupContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationMenu.Content className="border mt-2 slide-in-from-top-0 rounded text-[#d1d5db] hover:text-white  border-white/20 shadow-lg p-3 space-y-2 bg-gray-light absolute data-[motion=open]:animation-duration-100 data-[state=open]:animate-in  data-[state=closed]:animate-out data-[state=closed]:animation-duration-300 data-[state=open]:fade-in data-[state=closed]:fade-out">
      {children}
    </NavigationMenu.Content>
  );
};

const SubGroupTrigger = ({ label }: { label: string }) => {
  return (
    <NavigationMenu.Trigger className="outline-none text-base h-fit flex items-center w-full gap-2 px-3  rounded  transition-colors whitespace-nowrap writing-mode-horizontal">
      {label}
      <FaChevronRight className="text-red-500 text-sm rotate-90 transition-all duration-300" />
    </NavigationMenu.Trigger>
  );
};

const SubGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationMenu.Item className="my-auto hidden xl:block">
      {children}
    </NavigationMenu.Item>
  );
};

export { SubGroup, SubGroupContent, SubGroupTrigger };
