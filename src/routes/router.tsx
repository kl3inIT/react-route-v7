import { createBrowserRouter } from "react-router";
import { RequireLogin } from "./RequireLogin.tsx";
import { RequirePermission } from "./RequirePermission";
import ErrorBoundary from "./ErrorBoundary";
import { Layout } from "@/layouts";
import { APP_ROUTE_CONFIG } from "@/config/routes.config";

// Helper function để tạo route object
function createRouteObject(route: typeof APP_ROUTE_CONFIG[0]) {
    const routeObj: any = {
        lazy: route.lazyImport,
    };

    if (route.index) {
        routeObj.index = true;
    } else {
        routeObj.path = route.path;
    }

    return routeObj;
}

export const router = createBrowserRouter([
    // Public routes (không cần authentication)
    ...APP_ROUTE_CONFIG.filter((route) => !route.protected).map(createRouteObject),

    // Protected routes
    {
        element: <RequireLogin />,
        errorElement: <ErrorBoundary />,
        children: [
            // Routes với Layout
            {
                element: <Layout />,
                children: [
                    ...APP_ROUTE_CONFIG.filter((route) => route.protected && route.useLayout !== false).map((route) => {
                        // Nếu có roles, wrap trong RequirePermission
                        if (route.roles && route.roles.length > 0) {
                            return {
                                element: <RequirePermission roles={route.roles} />,
                                children: [createRouteObject(route)],
                            };
                        }

                        // Route không cần permission
                        return createRouteObject(route);
                    }),
                ],
            },
            // Routes không có Layout (nếu có)
            ...APP_ROUTE_CONFIG.filter((route) => route.protected && route.useLayout === false).map((route) => {
                if (route.roles && route.roles.length > 0) {
                    return {
                        element: <RequirePermission roles={route.roles} />,
                        children: [createRouteObject(route)],
                    };
                }
                return createRouteObject(route);
            }),
        ],
    },
]);
