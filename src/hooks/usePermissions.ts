import { useAuth } from "react-oidc-context";
import { type JmixRole, JMIX_ROLES } from "@/config/roles.config";
import type { MenuItemConfig } from "@/config/routes.config";

const JMIX_ROLES_CLAIM = "jmix-roles";

export function usePermissions() {
    const auth = useAuth();

    let roles: JmixRole[] = [];

    if (auth.user?.profile) {
        const profile = auth.user.profile as Record<string, unknown>;
        const claim = profile[JMIX_ROLES_CLAIM];

        if (Array.isArray(claim)) {
            const validRoles = Object.values(JMIX_ROLES) as JmixRole[];
            roles = claim.filter(
                (role): role is JmixRole => validRoles.includes(role as JmixRole)
            );
        }
    }

    const hasRole = (role: JmixRole): boolean =>
        roles.includes(role);

    const hasAnyRole = (checkRoles: JmixRole[]): boolean =>
        checkRoles.some((role) => roles.includes(role));

    const hasAllRoles = (checkRoles: JmixRole[]): boolean =>
        checkRoles.every((role) => roles.includes(role));

    const isSystemFullAccess = hasRole(JMIX_ROLES.SYSTEM_FULL_ACCESS);

    const canAccessMenuItem = (item: MenuItemConfig): boolean => {
        // Explicitly hidden
        if (item.visible === false) return false;

        // Full access role
        if (isSystemFullAccess) return true;

        // No role restriction
        if (!item.roles || item.roles.length === 0) return true;

        // At least one role matches
        return hasAnyRole(item.roles);
    };

    const filterMenuItems = (items: MenuItemConfig[]): MenuItemConfig[] => {
        return items
            .filter(canAccessMenuItem)
            .map((item) => ({
                ...item,
                items: item.items ? filterMenuItems(item.items) : undefined,
            }))
            .filter((item) => {
                // Hide empty groups
                return !(item.items && item.items.length === 0);
            });
    };

    return {
        roles,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        canAccessMenuItem,
        filterMenuItems,
        isSystemFullAccess,
    };
}
