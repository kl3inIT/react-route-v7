import { useState, useCallback, type PropsWithChildren } from "react";
import { LayoutContext, type LayoutState } from "@/layouts";

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

    const value = {
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


