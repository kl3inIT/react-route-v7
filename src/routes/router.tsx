// router.ts
import {createBrowserRouter} from "react-router";
import {RequirePermission} from "./RequirePermission";
import {RequireLogin} from "./RequireLogin";
import ErrorBoundary from "./ErrorBoundary";
import {Layout} from "@/layouts";
import {JMIX_ROLES} from "@/config/roles.config";
import {ROUTES} from "@/config/routes.config";
import {queryClient} from "@/contexts/queryClient";

export const router = createBrowserRouter([
    {
        path: ROUTES.AUTH_CALLBACK,
        lazy: async () => {
            const {default: Component} = await import(
                "@/pages/auth/AuthCallbackPage"
                );
            return {Component};
        },
    },

    {
        element: <RequireLogin/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const [{default: Component}, module] =
                                await Promise.all([
                                    import("@/pages/dashboard/DashboardPage"),
                                    import("@/pages/dashboard/loader"),
                                ]);

                            return {
                                Component,
                                loader: module.loader(queryClient),
                            };
                        },
                    },

                    {
                        element: (
                            <RequirePermission
                                roles={[
                                    JMIX_ROLES.SYSTEM_FULL_ACCESS,
                                    JMIX_ROLES.ADMIN,
                                ]}
                            />
                        ),
                        children: [
                            {
                                path: ROUTES.USERS,
                                lazy: async () => {
                                    const [{default: Component}, module] =
                                        await Promise.all([
                                            import("@/pages/users/UsersPage"),
                                            import("@/pages/users/loader"),
                                        ]);

                                    return {
                                        Component,
                                        loader: module.loader(queryClient),
                                    };
                                },
                            },
                        ],
                    },

                    {
                        path: ROUTES.PROFILE,
                        lazy: async () => {
                            const {default: Component} = await import(
                                "@/pages/profile/ProfilePage"
                                );
                            return {Component};
                        },
                    },
                ],
            },
        ],
    },
]);
