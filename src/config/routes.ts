
export const ROUTES = {
    // Public
    AUTH_CALLBACK: "/auth/callback",

    // Main
    DASHBOARD: "/",
    PROFILE: "/profile",

    // Users
    USERS: "/users",

    // Management
    PRODUCTS: "/products",
    ORDERS: "/orders",
    REPORTS: "/reports",

    // System
    SETTINGS: "/settings",
} as const;

// ============================================================================
// Jmix Resource Roles
// Đây là các roles được định nghĩa trong Jmix và map lên Keycloak
// https://docs.jmix.io/jmix/security/resource-roles.html
// ============================================================================

export const JMIX_ROLES = {
    // Built-in roles
    SYSTEM_FULL_ACCESS: "system-full-access",
    UI_MINIMAL: "ui-minimal",

    // Custom roles (định nghĩa trong Jmix backend)
    ADMIN: "admin",
    MANAGER: "manager",
    USER: "user",

    // Feature-specific roles
    USERS_ADMIN: "users-admin",
    PRODUCTS_ADMIN: "products-admin",
    ORDERS_ADMIN: "orders-admin",
    REPORTS_VIEWER: "reports-viewer",
} as const;

export type JmixRole = (typeof JMIX_ROLES)[keyof typeof JMIX_ROLES];


export interface MenuItemConfig {
    label: string;
    icon?: string;
    to?: string;
    url?: string;
    target?: string;
    badge?: string;
    roles?: JmixRole[]; // Cần có ÍT NHẤT 1 role trong list
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
                roles: [JMIX_ROLES.USERS_ADMIN, JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
            },
        ],
    },
    {
        label: "Quản lý",
        roles: [
            JMIX_ROLES.PRODUCTS_ADMIN,
            JMIX_ROLES.ORDERS_ADMIN,
            JMIX_ROLES.REPORTS_VIEWER,
            JMIX_ROLES.MANAGER,
            JMIX_ROLES.ADMIN,
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
