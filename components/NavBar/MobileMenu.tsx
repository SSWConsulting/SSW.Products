import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";

type MenuContextType = { setIsOpen: (open: boolean) => void };

const MenuContext = React.createContext<MenuContextType>({
  setIsOpen: () => {},
});

const useMenuContext = () => React.useContext(MenuContext);

const MenuContextProvider = MenuContext.Provider;

const MobileMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MenuContextProvider value={{ setIsOpen }}>
      <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        {children}
      </Popover.Root>
      ;
    </MenuContextProvider>
  );
};

export { MobileMenuRoot, useMenuContext };
