import { type JmixRole, JMIX_ROLES } from "./roles.config";

export const ROUTES = {
    AUTH_CALLBACK: "/auth/callback",
    DASHBOARD: "/",
    PROFILE: "/profile",
    USERS: "/users",
    SETTINGS: "/settings",
} as const;

export interface MenuItemConfig {
    label: string;
    icon?: string;
    to?: string;
    badge?: string;
    roles?: JmixRole[];
    items?: MenuItemConfig[];
    visible?: boolean;
}

export const MENU_CONFIG: MenuItemConfig[] = [
    {
        label: "Menu chính",
        items: [
            {
                label: "Dashboard",
                icon: "pi pi-home",
                to: ROUTES.DASHBOARD,
            },
            {
                label: "Người dùng",
                icon: "pi pi-users",
                to: ROUTES.USERS,
                roles: [JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
        ],
    },
    {
        label: "Quản lý",
        roles: [
            JMIX_ROLES.SYSTEM_FULL_ACCESS,
        ],
        items: [
            {
                label: "Sản phẩm",
                icon: "pi pi-box",
                to: ROUTES.PRODUCTS,
                roles: [JMIX_ROLES.PRODUCTS_ADMIN, JMIX_ROLES.MANAGER, JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
            {
                label: "Đơn hàng",
                icon: "pi pi-shopping-cart",
                to: ROUTES.ORDERS,
                roles: [JMIX_ROLES.ORDERS_ADMIN, JMIX_ROLES.MANAGER, JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
            {
                label: "Báo cáo",
                icon: "pi pi-chart-bar",
                to: ROUTES.REPORTS,
                roles: [JMIX_ROLES.REPORTS_VIEWER, JMIX_ROLES.MANAGER, JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
        ],
    },
    {
        label: "Hệ thống",
        roles: [JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
        items: [
            {
                label: "Cài đặt",
                icon: "pi pi-cog",
                to: ROUTES.SETTINGS,
                roles: [JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
        ],
    },
];
