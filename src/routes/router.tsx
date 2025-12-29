import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "@/layouts";
import { ROUTES } from "@/config/routes";
import ErrorBoundary from "./ErrorBoundary";

export const router = createBrowserRouter([
    // Auth callback (public)
    {
        path: ROUTES.AUTH_CALLBACK,
        lazy: async () => {
            const { default: Component } = await import("@/pages/auth/AuthCallbackPage");
            return { Component };
        },
    },

    // Protected routes
    {
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                element: <Layout />,
                children: [
                    // Dashboard
                    {
                        path: ROUTES.DASHBOARD,
                        index: true,
                        lazy: async () => {
                            const [{ default: Component }, { loader }] = await Promise.all([
                                import("@/pages/dashboard/DashboardPage"),
                                import("@/pages/dashboard/loader"),
                            ]);
                            return { Component, loader };
                        },
                    },
                    // Users
                    {
                        path: ROUTES.USERS.slice(1), // Remove leading slash
                        lazy: async () => {
                            const { default: Component } = await import("@/pages/users/UsersPage");
                            return { Component };
                        },
                    },
                    // Profile
                    {
                        path: ROUTES.PROFILE.slice(1),
                        lazy: async () => {
                            const { default: Component } = await import("@/pages/profile/ProfilePage");
                            return { Component };
                        },
                    },
                    // Products (placeholder)
                    {
                        path: ROUTES.PRODUCTS.slice(1),
                        lazy: async () => ({
                            Component: () => <div className="p-4"><h1>Sản phẩm</h1><p>Coming soon...</p></div>,
                        }),
                    },
                    // Orders (placeholder)
                    {
                        path: ROUTES.ORDERS.slice(1),
                        lazy: async () => ({
                            Component: () => <div className="p-4"><h1>Đơn hàng</h1><p>Coming soon...</p></div>,
                        }),
                    },
                    // Reports (placeholder)
                    {
                        path: ROUTES.REPORTS.slice(1),
                        lazy: async () => ({
                            Component: () => <div className="p-4"><h1>Báo cáo</h1><p>Coming soon...</p></div>,
                        }),
                    },
                    // Settings (placeholder)
                    {
                        path: ROUTES.SETTINGS.slice(1),
                        lazy: async () => ({
                            Component: () => <div className="p-4"><h1>Cài đặt</h1><p>Coming soon...</p></div>,
                        }),
                    },
                ],
            },
        ],
    },
]);
