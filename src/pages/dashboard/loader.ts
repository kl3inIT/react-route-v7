import type { LoaderFunctionArgs } from "react-router";

/**
 * Dashboard page loader
 */
export async function loader(_args: LoaderFunctionArgs) {
    // Load dashboard stats, user info, etc.
    return {
        stats: {
            users: 1234,
            orders: 567,
            products: 89,
            revenue: 12345,
        },
    };
}


