import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { MenuContext } from "@/layouts";
import type { MenuItemConfig } from "@/config/routes.config";

interface AppMenuItemProps {
    item: MenuItemConfig;
    index: number;
    root?: boolean;
    parentKey?: string;
}

export function AppMenuItem({ item, index, root = false, parentKey }: AppMenuItemProps) {
    const location = useLocation();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);

    const key = parentKey ? `${parentKey}-${index}` : String(index);
    const isActiveRoute = item.to === location.pathname;
    const active = activeMenu === key || activeMenu.startsWith(`${key}-`);
    const submenuOpen = root || active;

    useEffect(() => {
        if (item.to && isActiveRoute) {
            setActiveMenu(key);
        }
    }, [isActiveRoute, item.to, key, setActiveMenu]);

    if (item.visible === false) return null;

    const handleClick = () => {
        if (item.items) {
            setActiveMenu(active ? parentKey ?? "" : key);
        } else {
            setActiveMenu(key);
        }
    };

    const baseClass = classNames("p-ripple hover:surface-hover", {
        "text-primary font-semibold bg-primary-100": isActiveRoute,
        "text-color": !isActiveRoute,
    });

    const commonStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        textDecoration: "none",
    };

    const content = (
        <>
            {item.icon && <i className={classNames(item.icon, "mr-3")} />}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
                <span className="bg-primary text-white text-xs px-2 py-1 border-round ml-2">
                    {item.badge}
                </span>
            )}
            {item.items && (
                <i
                    className={classNames("pi pi-angle-down ml-auto transition-transform transition-duration-200", {
                        "rotate-180": submenuOpen,
                    })}
                />
            )}
            <Ripple />
        </>
    );

    return (
        <li className="mb-1">
            {root && (
                <div className="text-xs uppercase font-bold text-500 mt-4 mb-2 px-3">
                    {item.label}
                </div>
            )}

            {!root && (
            <>
                {item.to ? (
                    <Link to={item.to} onClick={handleClick} className={baseClass} style={commonStyle}>
                        {content}
                    </Link>
                ) : (
                    <div onClick={handleClick} className={baseClass} style={commonStyle}>
                        {content}
                    </div>
                )}
            </>
            )}

            {item.items && submenuOpen && (
                <ul className="list-none p-0 m-0 pl-4 overflow-hidden">
                    {item.items.map((child, i) => (
                        <AppMenuItem item={child} index={i} parentKey={key} key={`${key}-${i}`} />
                    ))}
                </ul>
            )}
        </li>
    );
}
