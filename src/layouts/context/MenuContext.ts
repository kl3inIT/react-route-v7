import React, { createContext } from "react";

export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

export const MenuContext = createContext<MenuContextProps>({} as MenuContextProps);

