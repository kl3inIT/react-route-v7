import { useContext } from "react";
import { Sidebar } from "primereact/sidebar";
import { AppMenu } from "./AppMenu";
import { LayoutContext, type LayoutState } from "../context/LayoutContext";

export function AppSidebar() {
    const { layoutState, setLayoutState, isDesktop } = useContext(LayoutContext);

    const isMobile = !isDesktop();
    const isVisible = isMobile
        ? layoutState.staticMenuMobileActive
        : !layoutState.staticMenuDesktopInactive;

    const onHide = () => {
        setLayoutState((prev: LayoutState) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
        }));
    };

    // Mobile: use PrimeReact Sidebar (modal)
    if (isMobile) {
        return (
            <Sidebar
                visible={isVisible}
                onHide={onHide}
                modal
                className="w-18rem"
                pt={{
                    header: { className: "hidden" },
                    content: { className: "p-3" },
                }}
            >
                <div className="flex align-items-center gap-2 mb-4 px-2">
                    <i className="pi pi-prime text-primary text-2xl" />
                    <span className="font-bold text-xl">Admin Panel</span>
                </div>
                <AppMenu />
            </Sidebar>
        );
    }

    // Desktop: fixed sidebar
    if (!isVisible) return null;

    return (
        <aside
            className="surface-card border-right-1 surface-border h-screen overflow-y-auto p-3"
            style={{
                position: "fixed",
                top: "60px",
                left: 0,
                width: "250px",
                height: "calc(100vh - 60px)",
                zIndex: 996,
            }}
        >
            <AppMenu />
        </aside>
    );
}
