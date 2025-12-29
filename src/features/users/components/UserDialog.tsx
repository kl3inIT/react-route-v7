import { Dialog } from "primereact/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/rootReducer";
import { closeCreateDialog, closeEditDialog } from "../slice";
import { useCreateUser, useUpdateUser } from "../hooks";
import { UserForm } from "./UserForm";
import type { CreateUserDto } from "../types";

export function UserDialog() {
    const dispatch = useAppDispatch();
    const { isCreateDialogOpen, isEditDialogOpen, editingUser } = useAppSelector(
        (state: RootState) => state.users
    );

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();

    const isOpen = isCreateDialogOpen || isEditDialogOpen;
    const isEdit = isEditDialogOpen && !!editingUser;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const handleClose = () => {
        if (isCreateDialogOpen) {
            dispatch(closeCreateDialog());
        } else {
            dispatch(closeEditDialog());
        }
    };

    const handleSubmit = async (data: CreateUserDto) => {
        try {
            if (isEdit && editingUser) {
                await updateMutation.mutateAsync({ id: editingUser.id, ...data });
            } else {
                await createMutation.mutateAsync(data);
            }
            handleClose();
        } catch {
            // Error is handled by React Query
        }
    };

    return (
        <Dialog
            visible={isOpen}
            onHide={handleClose}
            header={isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            style={{ width: "500px" }}
            modal
            draggable={false}
            closable={!isLoading}
            closeOnEscape={!isLoading}
        >
            <UserForm
                user={editingUser}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                loading={isLoading}
            />
        </Dialog>
    );
}

