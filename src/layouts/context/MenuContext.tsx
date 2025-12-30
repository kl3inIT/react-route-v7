import React, { createContext, useState, type PropsWithChildren } from "react";

export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>; //(value: string | ((prev: string) => string)) => void
}

export const MenuContext = createContext<MenuContextProps>({} as MenuContextProps);

export function MenuProvider({ children }: PropsWithChildren) {
    const [activeMenu, setActiveMenu] = useState("");

    return (
        <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </MenuContext.Provider>
    );
}



