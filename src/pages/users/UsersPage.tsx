import { useLoaderData } from "react-router";
import { UserTableSuspense, UserDialog, DeleteUserDialog } from "@/features/users";
import { SuspenseLoader } from "@/components";
import type { loader } from "./loader";

// Type-safe loader data
type LoaderData = Awaited<ReturnType<ReturnType<typeof loader>>>;

export default function UsersPage() {
    // Access loader data (following TanStack pattern)
    const { search } = useLoaderData() as LoaderData;

    // search có thể được sử dụng để filter, sync URL state, etc.
    console.log("Search param from URL:", search);

    return (
        <>
            {/* 
             * SuspenseLoader wraps component that uses useSuspenseQuery
             * - Loading state: Handled by Suspense fallback
             * - Error state: Handled by ErrorBoundary (in router config)
             */}
            <SuspenseLoader message="Đang tải danh sách người dùng...">
                <UserTableSuspense />
            </SuspenseLoader>
            
            <UserDialog />
            <DeleteUserDialog />
        </>
    );
}



