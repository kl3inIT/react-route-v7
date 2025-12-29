import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { MenuContext } from "../context/MenuContext";

export interface AppMenuItemType {
    label: string;
    icon?: string;
    to?: string;
    url?: string;
    target?: string;
    items?: AppMenuItemType[];
    badge?: string;
    separator?: boolean;
    disabled?: boolean;
    visible?: boolean;
    command?: (event: { originalEvent: React.MouseEvent; item: AppMenuItemType }) => void;
}

interface AppMenuItemProps {
    item: AppMenuItemType;
    index: number;
    root?: boolean;
    parentKey?: string;
}

export function AppMenuItem({ item, index, root = false, parentKey }: AppMenuItemProps) {
    const location = useLocation();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);

    const key = parentKey ? `${parentKey}-${index}` : String(index);
    const isActiveRoute = item.to && location.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(`${key}-`);
    const [submenuOpen, setSubmenuOpen] = useState(root || active);

    useEffect(() => {
        if (item.to && item.to === location.pathname) {
            setActiveMenu(key);
        }
    }, [location.pathname, item.to, key, setActiveMenu]);

    useEffect(() => {
        if (active) setSubmenuOpen(true);
    }, [active]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (item.command) {
            item.command({ originalEvent: event, item });
        }

        if (item.items) {
            setSubmenuOpen(!submenuOpen);
            setActiveMenu(active ? (parentKey || "") : key);
        } else {
            setActiveMenu(key);
        }
    };

    if (item.separator) {
        return <li className="my-2 border-top-1 surface-border" />;
    }

    if (item.visible === false) {
        return null;
    }

    const linkStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderRadius: "var(--border-radius)",
        color: isActiveRoute ? "var(--primary-color)" : "var(--text-color)",
        backgroundColor: isActiveRoute ? "var(--primary-100)" : "transparent",
        textDecoration: "none",
        cursor: "pointer",
        fontWeight: isActiveRoute ? 600 : 400,
        transition: "background-color 0.2s",
    };

    return (
        <li className="mb-1">
            {root && (
                <div className="text-xs uppercase font-bold text-500 mt-4 mb-2 px-3">
                    {item.label}
                </div>
            )}

            {(!item.to || item.items) && !root && (
                <a
                    href={item.url || "#"}
                    onClick={itemClick}
                    style={linkStyle}
                    className="p-ripple hover:surface-hover"
                    target={item.target}
                >
                    {item.icon && <i className={classNames(item.icon, "mr-3")} />}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                        <span className="bg-primary text-white text-xs px-2 py-1 border-round ml-2">
                            {item.badge}
                        </span>
                    )}
                    {item.items && (
                        <i className={classNames("pi pi-angle-down ml-auto transition-transform transition-duration-200", {
                            "rotate-180": submenuOpen,
                        })} />
                    )}
                    <Ripple />
                </a>
            )}

            {item.to && !item.items && (
                <Link
                    to={item.to}
                    onClick={itemClick}
                    style={linkStyle}
                    className="p-ripple hover:surface-hover"
                    target={item.target}
                >
                    {item.icon && <i className={classNames(item.icon, "mr-3")} />}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                        <span className="bg-primary text-white text-xs px-2 py-1 border-round ml-2">
                            {item.badge}
                        </span>
                    )}
                    <Ripple />
                </Link>
            )}

            {item.items && submenuOpen && (
                <ul className="list-none p-0 m-0 pl-4 overflow-hidden">
                    {item.items.map((child, i) => (
                        <AppMenuItem
                            item={child}
                            index={i}
                            parentKey={key}
                            key={child.label}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
