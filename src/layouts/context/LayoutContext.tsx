import { createContext, useState, useCallback, type PropsWithChildren } from "react";

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

export function LayoutProvider({ children }: PropsWithChildren) {
    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        staticMenuMobileActive: false,
    });

    const isDesktop = useCallback(() => {
        return window.innerWidth > 991;
    }, []);

    const onMenuToggle = useCallback(() => {
        if (isDesktop()) {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !prev.staticMenuDesktopInactive,
            }));
        } else {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuMobileActive: !prev.staticMenuMobileActive,
            }));
        }
    }, [isDesktop]);

    const value: LayoutContextProps = {
        layoutState,
        setLayoutState,
        onMenuToggle,
        isDesktop,
    };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}
