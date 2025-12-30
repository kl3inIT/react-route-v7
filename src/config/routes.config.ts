import type React from "react";
import { type JmixRole, JMIX_ROLES } from "./roles.config";

// ============================================================================
// Route Paths Constants
// ============================================================================

export const ROUTES = {
    AUTH_CALLBACK: "/auth/callback",
    DASHBOARD: "/",
    PROFILE: "/profile",
    USERS: "/users",
    SETTINGS: "/settings",
    // Các routes chưa implement (dùng cho menu config)
    PRODUCTS: "/products",
    ORDERS: "/orders",
    REPORTS: "/reports",
} as const;

// ============================================================================
// App Route Configuration Interface
// ============================================================================

/**
 * App Route Configuration
 * Single source of truth cho routes - dùng cho cả router và menu
 */
export interface AppRouteConfig {
    /** Route path (absolute path) */
    path: string;
    /** Label cho menu (optional - chỉ routes có menu mới cần) */
    label?: string;
    /** Icon cho menu (optional) */
    icon?: string;
    /** Required roles (optional) */
    roles?: JmixRole[];
    /** Lazy import function cho component, loader, action */
    lazyImport: () => Promise<{
        Component?: React.ComponentType;
        default?: React.ComponentType;
        loader?: any;
        action?: any;
    }>;
    /** Is index route */
    index?: boolean;
    /** Should use Layout wrapper (default: true for protected routes) */
    useLayout?: boolean;
    /** Should use RequireLogin wrapper (default: true) */
    protected?: boolean;
}

/**
 * App Route Configurations
 * Thêm route mới ở đây - tự động generate router và menu
 */
export const APP_ROUTE_CONFIG: AppRouteConfig[] = [
    // Public routes (không cần login)
    {
        path: ROUTES.AUTH_CALLBACK,
        protected: false,
        useLayout: false,
        lazyImport: async () => {
            const { default: Component } = await import("@/pages/auth/AuthCallbackPage");
            return { Component };
        },
    },

    // Protected routes với Layout
    {
        path: ROUTES.DASHBOARD,
        label: "Dashboard",
        icon: "pi pi-home",
        index: true,
        useLayout: true,
        protected: true,
        lazyImport: async () => {
            const [{ default: Component }, { loader }] = await Promise.all([
                import("@/pages/dashboard/DashboardPage"),
                import("@/pages/dashboard/loader"),
            ]);
            return { Component, loader };
        },
    },
    {
        path: ROUTES.USERS,
        label: "Người dùng",
        icon: "pi pi-users",
        roles: [JMIX_ROLES.SYSTEM_FULL_ACCESS, JMIX_ROLES.ADMIN],
        useLayout: true,
        protected: true,
        lazyImport: async () => {
            const [{ default: Component }, { loader }] = await Promise.all([
                import("@/pages/users/UsersPage"),
                import("@/pages/users/loader"),
            ]);
            return { Component, loader };
        },
    },
    {
        path: ROUTES.PROFILE,
        label: "Thông tin cá nhân",
        icon: "pi pi-user",
        roles: [JMIX_ROLES.SYSTEM_FULL_ACCESS, JMIX_ROLES.ADMIN],
        useLayout: true,
        protected: true,
        lazyImport: async () => {
            const { default: Component } = await import("@/pages/profile/ProfilePage");
            return { Component };
        },
    },
    // Thêm routes mới ở đây...
    // {
    //     path: ROUTES.SETTINGS,
    //     label: "Cài đặt",
    //     icon: "pi pi-cog",
    //     roles: [JMIX_ROLES.ADMIN, JMIX_ROLES.SYSTEM_FULL_ACCESS],
    //     useLayout: true,
    //     protected: true,
    //     lazyImport: async () => {
    //         const { default: Component } = await import("@/pages/settings/SettingsPage");
    //         return { Component };
    //     },
    // },
];

// ============================================================================
// Menu Configuration Interface
// ============================================================================

export interface MenuItemConfig {
    label: string;
    icon?: string;
    to?: string;
    badge?: string;
    roles?: JmixRole[];
    items?: MenuItemConfig[];
    visible?: boolean;
}

/**
 * Generate menu config from route configs
 * Chỉ routes có label mới được thêm vào menu
 */
export function generateMenuConfig(routes: AppRouteConfig[]): MenuItemConfig[] {
    const mapToMenu = (items: AppRouteConfig[]): MenuItemConfig[] => {
        return items
            .filter((route) => route.label) // Chỉ menu route có label
            .map((route) => ({
                label: route.label!,
                icon: route.icon,
                to: route.path,
                roles: route.roles,
                visible: true,
            }));
    };

    return mapToMenu(routes);
}

/**
 * Menu configuration
 * Có thể dùng generateMenuConfig(APP_ROUTE_CONFIG) hoặc define manual
 */
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
