import { UserTableSuspense, UserDialog, DeleteUserDialog } from "@/features/users";

export default function UsersPage() {
    return (
        <>
            {/* 
             * UserTableSuspense sử dụng useSuspenseQuery
             * - Loading: Handled by SuspenseOutlet trong router.tsx
             * - Error: Handled by ErrorBoundary trong router.tsx
             */}
            <UserTableSuspense />
            <UserDialog />
            <DeleteUserDialog />
        </>
    );
}



