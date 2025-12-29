import { useMemo } from "react";
import { MenuProvider } from "../context/MenuContext";
import { AppMenuItem, type AppMenuItemType } from "./AppMenuItem";
import { MENU_CONFIG } from "@/config/routes";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * Convert MenuItemConfig to AppMenuItemType
 */
function convertToAppMenuItem(config: typeof MENU_CONFIG): AppMenuItemType[] {
    return config.map((item) => ({
        label: item.label,
        icon: item.icon,
        to: item.to,
        url: item.url,
        target: item.target,
        badge: item.badge,
        visible: item.visible,
        items: item.items ? convertToAppMenuItem(item.items) : undefined,
    }));
}

export function AppMenu() {
    const { filterMenuItems } = usePermissions();

    // Filter menu dựa trên permissions và convert sang format của AppMenuItem
    const menuItems = useMemo(() => {
        const filteredConfig = filterMenuItems(MENU_CONFIG);
        return convertToAppMenuItem(filteredConfig);
    }, [filterMenuItems]);

    return (
        <MenuProvider>
            <ul className="list-none p-0 m-0">
                {menuItems.map((item, i) => (
                    <AppMenuItem item={item} root index={i} key={item.label} />
                ))}
            </ul>
        </MenuProvider>
    );
}
