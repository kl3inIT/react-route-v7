// src/router/RequirePermission.tsx
import { Navigate, Outlet } from "react-router";
import { usePermissions } from "@/hooks/usePermissions";
import type { JmixRole } from "@/config/roles.config";

interface RequirePermissionProps {
    roles: JmixRole[];
}

export function RequirePermission({ roles }: RequirePermissionProps) {
    const { hasAnyRole } = usePermissions();

    if (!hasAnyRole(roles)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
