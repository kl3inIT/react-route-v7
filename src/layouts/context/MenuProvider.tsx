import { useState, type PropsWithChildren } from "react";
import { MenuContext } from "@/layouts";

export function MenuProvider({ children }: PropsWithChildren) {
    const [activeMenu, setActiveMenu] = useState("");

    return (
        <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

