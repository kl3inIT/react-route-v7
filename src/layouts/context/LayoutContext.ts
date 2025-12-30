import React, { createContext } from "react";

export interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    staticMenuMobileActive: boolean;
}

export interface LayoutContextProps {
    layoutState: LayoutState;
    setLayoutState: React.Dispatch<React.SetStateAction<LayoutState>>;
    onMenuToggle: () => void;
    isDesktop: () => boolean;
}

export const LayoutContext = createContext<LayoutContextProps>({} as LayoutContextProps);

