export const JMIX_ROLES = {
    SYSTEM_FULL_ACCESS: "system-full-access",
    UI_MINIMAL: "ui-minimal",

    ADMIN: "admin",
    MANAGER: "manager",
    USER: "user",

    USERS_ADMIN: "users-admin",
    PRODUCTS_ADMIN: "products-admin",
    ORDERS_ADMIN: "orders-admin",
    REPORTS_VIEWER: "reports-viewer",
} as const;

export type JmixRole = (typeof JMIX_ROLES)[keyof typeof JMIX_ROLES];
