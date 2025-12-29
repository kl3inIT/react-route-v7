import { UserTable, UserDialog, DeleteUserDialog } from "@/features/users";

export default function UsersPage() {
    return (
        <>
            <UserTable />
            <UserDialog />
            <DeleteUserDialog />
        </>
    );
}


