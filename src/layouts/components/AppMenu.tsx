import { MenuProvider } from "@/layouts";
import { AppMenuItem } from "@/layouts";
import { MENU_CONFIG } from "@/config/routes.config";
import { usePermissions } from "@/hooks/usePermissions";

export function AppMenu() {
    const { filterMenuItems } = usePermissions();

    const menuItems = filterMenuItems(MENU_CONFIG);

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
