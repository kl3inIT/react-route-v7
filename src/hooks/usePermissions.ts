import { useMemo, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { type JmixRole, JMIX_ROLES, type MenuItemConfig } from "@/config/routes";

/**
 * Jmix OIDC roles configuration
 * 
 * Jmix lưu roles trong JWT token qua claim "jmix-roles"
 * Được config bởi DefaultClaimsRolesMapper trong Jmix backend
 * 
 * Tham khảo: https://docs.jmix.io/jmix/oidc/index.html
 */

// Claim name chứa Jmix roles (theo config DefaultClaimsRolesMapper)
const JMIX_ROLES_CLAIM = "jmix-roles";

interface UsePermissionsReturn {
    roles: JmixRole[];
    hasRole: (role: JmixRole) => boolean;
    hasAnyRole: (roles: JmixRole[]) => boolean;
    hasAllRoles: (roles: JmixRole[]) => boolean;
    canAccessMenuItem: (item: MenuItemConfig) => boolean;
    filterMenuItems: (items: MenuItemConfig[]) => MenuItemConfig[];
    isAdmin: boolean;
    isSystemFullAccess: boolean;
}

/**
 * Hook để check Jmix roles từ Keycloak token
 */
export function usePermissions(): UsePermissionsReturn {
    const auth = useAuth();

    // Extract roles từ Jmix token claim "jmix-roles"
    const roles = useMemo<JmixRole[]>(() => {
        if (!auth.user) return [];

        const profile = auth.user.profile as Record<string, unknown>;

        // Lấy từ claim "jmix-roles" (Jmix DefaultClaimsRolesMapper)
        const jmixRoles = profile?.[JMIX_ROLES_CLAIM] as string[] | undefined;

        if (!jmixRoles || !Array.isArray(jmixRoles)) {
            console.warn("[usePermissions] No jmix-roles found in token");
            return [];
        }

        // Log để debug
        console.log("[usePermissions] Jmix roles from token:", jmixRoles);

        // Filter chỉ lấy valid Jmix roles đã định nghĩa
        const validJmixRoles = Object.values(JMIX_ROLES);

        return jmixRoles.filter((r): r is JmixRole =>
            validJmixRoles.includes(r as JmixRole)
        );
    }, [auth.user]);

    const hasRole = useCallback(
        (role: JmixRole): boolean => roles.includes(role),
        [roles]
    );

    const hasAnyRole = useCallback(
        (checkRoles: JmixRole[]): boolean => checkRoles.some((role) => roles.includes(role)),
        [roles]
    );

    const hasAllRoles = useCallback(
        (checkRoles: JmixRole[]): boolean => checkRoles.every((role) => roles.includes(role)),
        [roles]
    );

    const isAdmin = useMemo(
        () => hasRole(JMIX_ROLES.ADMIN),
        [hasRole]
    );

    const isSystemFullAccess = useMemo(
        () => hasRole(JMIX_ROLES.SYSTEM_FULL_ACCESS),
        [hasRole]
    );

    /**
     * Check nếu user có thể truy cập menu item
     */
    const canAccessMenuItem = useCallback(
        (item: MenuItemConfig): boolean => {
            // Nếu item bị ẩn
            if (item.visible === false) return false;

            // system-full-access có thể truy cập tất cả
            if (isSystemFullAccess) return true;

            // Nếu không có roles requirement, ai cũng access được
            if (!item.roles || item.roles.length === 0) return true;

            // Check có ít nhất 1 role match
            return hasAnyRole(item.roles);
        },
        [isSystemFullAccess, hasAnyRole]
    );

    /**
     * Filter menu items dựa trên roles
     */
    const filterMenuItems = useCallback(
        (items: MenuItemConfig[]): MenuItemConfig[] => {
            return items
                .filter(canAccessMenuItem)
                .map((item) => ({
                    ...item,
                    items: item.items ? filterMenuItems(item.items) : undefined,
                }))
                .filter((item) => {
                    // Nếu là group menu mà không còn children, ẩn luôn
                    if (item.items && item.items.length === 0) return false;
                    return true;
                });
        },
        [canAccessMenuItem]
    );

    return {
        roles,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        canAccessMenuItem,
        filterMenuItems,
        isAdmin,
        isSystemFullAccess,
    };
}
