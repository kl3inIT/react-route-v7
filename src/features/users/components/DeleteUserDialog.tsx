import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/rootReducer";
import { closeDeleteDialog, clearSelectedUsers } from "../slice";
import { useDeleteUsers } from "../hooks";

export function DeleteUserDialog() {
    const dispatch = useAppDispatch();
    const { isDeleteDialogOpen, selectedUsers } = useAppSelector((state: RootState) => state.users);
    const deleteMutation = useDeleteUsers();

    const handleClose = () => {
        dispatch(closeDeleteDialog());
    };

    const handleConfirm = async () => {
        try {
            const ids = selectedUsers.map((u: { id: string }) => u.id);
            await deleteMutation.mutateAsync(ids);
            dispatch(clearSelectedUsers());
            handleClose();
        } catch {
            // Error is handled by React Query
        }
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Hủy"
                icon="pi pi-times"
                outlined
                onClick={handleClose}
                disabled={deleteMutation.isPending}
            />
            <Button
                label="Xóa"
                icon={deleteMutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                severity="danger"
                onClick={handleConfirm}
                disabled={deleteMutation.isPending}
            />
        </div>
    );

    return (
        <Dialog
            visible={isDeleteDialogOpen}
            onHide={handleClose}
            header="Xác nhận xóa"
            footer={footer}
            style={{ width: "450px" }}
            modal
            draggable={false}
            closable={!deleteMutation.isPending}
        >
            <div className="flex align-items-center gap-3">
                <i
                    className="pi pi-exclamation-triangle text-5xl text-yellow-500"
                    style={{ fontSize: "3rem" }}
                />
                <div>
                    {selectedUsers.length === 1 ? (
                        <p className="m-0">
                            Bạn có chắc chắn muốn xóa người dùng{" "}
                            <strong>{selectedUsers[0].username}</strong>?
                        </p>
                    ) : (
                        <p className="m-0">
                            Bạn có chắc chắn muốn xóa{" "}
                            <strong>{selectedUsers.length}</strong> người dùng đã chọn?
                        </p>
                    )}
                    <p className="text-500 mt-2 mb-0">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>
            </div>
        </Dialog>
    );
}

