import type { LoaderFunctionArgs } from "react-router";
import type { QueryClient } from "@tanstack/react-query";

/**
 * Dashboard page loader
 */
export const loader =
    (queryClient: QueryClient) =>
        async (_args: LoaderFunctionArgs) => {
            // Load dashboard stats, user info, etc.
            return {
                stats: {
                    users: 1234,
                    orders: 567,
                    products: 89,
                    revenue: 12345,
                },
            };
        };




