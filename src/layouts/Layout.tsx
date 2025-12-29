import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigation } from "react-router";
import { ProgressBar } from "primereact/progressbar";
import { AppTopbar } from "./components/AppTopbar";
import { AppSidebar } from "./components/AppSidebar";
import { AppFooter } from "./components/AppFooter";
import { LayoutContext, type LayoutState } from "./context/LayoutContext";

export function Layout() {
    const { layoutState, setLayoutState, isDesktop } = useContext(LayoutContext);
    const location = useLocation();
    const navigation = useNavigation();

    const isLoading = navigation.state === "loading";
    const isMobile = !isDesktop();
    const sidebarVisible = !isMobile && !layoutState.staticMenuDesktopInactive;

    // Hide menu on route change (mobile)
    useEffect(() => {
        setLayoutState((prev: LayoutState) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
        }));
    }, [location.pathname, setLayoutState]);

    return (
        <div className="min-h-screen surface-ground">
            <AppTopbar />

            {isLoading && (
                <ProgressBar
                    mode="indeterminate"
                    style={{ height: "3px", position: "fixed", top: "60px", left: 0, right: 0, zIndex: 1000 }}
                />
            )}

            <AppSidebar />

            <div
                style={{
                    marginLeft: sidebarVisible ? "250px" : 0,
                    paddingTop: "60px",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    transition: "margin-left 0.3s",
                }}
            >
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
                <AppFooter />
            </div>
        </div>
    );
}
