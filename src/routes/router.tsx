import { RequirePermission } from "./RequirePermission";
import { JMIX_ROLES } from "@/config/roles.config";
import { ROUTES } from "@/config/routes.config";
import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import ErrorBoundary from "./ErrorBoundary";
import { Layout } from "@/layouts";

export const router = createBrowserRouter([
    {
        path: ROUTES.AUTH_CALLBACK,
        lazy: async () => {
            const { default: Component } = await import("@/pages/auth/AuthCallbackPage");
            return { Component };
        },
    },
    {
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        index: true,
                        path: ROUTES.DASHBOARD,
                        lazy: async () => {
                            const [{ default: Component }, { loader }] = await Promise.all([
                                import("@/pages/dashboard/DashboardPage"),
                                import("@/pages/dashboard/loader"),
                            ]);
                            return { Component, loader };
                        },
                    },

                    {
                        element: <RequirePermission roles={[JMIX_ROLES.SYSTEM_FULL_ACCESS, JMIX_ROLES.ADMIN]} />,
                        children: [
                            {
                                path: ROUTES.USERS.slice(1),
                                lazy: async () => {
                                    const { default: Component } = await import("@/pages/users/UsersPage");
                                    return { Component };
                                },
                            },
                        ],
                    },

                    // Profile: không cần role, chỉ login
                    {
                        path: ROUTES.PROFILE.slice(1),
                        lazy: async () => {
                            const { default: Component } = await import("@/pages/profile/ProfilePage");
                            return { Component };
                        },
                    },
                ],
            },
        ],
    },
]);
