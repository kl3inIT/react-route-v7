import { DataTable, type DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/rootReducer";
import {
    setSelectedUsers,
    setGlobalFilter,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
} from "../slice";
import { useUsers } from "../hooks";
import { HttpError } from "@/api/HttpError";
import type { User } from "../types";

export function UserTable() {
    const dispatch = useAppDispatch();
    const { selectedUsers, globalFilter } = useAppSelector((state: RootState) => state.users);
    const { data: users = [], isLoading, error, refetch } = useUsers();

    const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<User[]>) => {
        dispatch(setSelectedUsers(e.value));
    };

    const statusBodyTemplate = (user: User) => (
        <Tag
            value={user.active ? "Active" : "Inactive"}
            severity={user.active ? "success" : "danger"}
        />
    );

    const nameBodyTemplate = (user: User) => (
        <span style={{ fontWeight: 500 }}>
            {user.firstName} {user.lastName}
        </span>
    );

    const actionBodyTemplate = (user: User) => (
        <>
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                severity="warning"
                size="small"
                onClick={() => dispatch(openEditDialog(user))}
                tooltip="Sửa"
                tooltipOptions={{ position: "top" }}
                style={{ marginRight: "0.5rem" }}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                size="small"
                onClick={() => {
                    dispatch(setSelectedUsers([user]));
                    dispatch(openDeleteDialog());
                }}
                tooltip="Xóa"
                tooltipOptions={{ position: "top" }}
            />
        </>
    );

    const startContent = (
        <>
            <Button
                label="Thêm mới"
                icon="pi pi-plus"
                severity="success"
                onClick={() => dispatch(openCreateDialog())}
                style={{ marginRight: "0.5rem" }}
            />
            <Button
                label="Xóa"
                icon="pi pi-trash"
                severity="danger"
                onClick={() => dispatch(openDeleteDialog())}
                disabled={!selectedUsers.length}
            />
        </>
    );

    const endContent = (
        <>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    value={globalFilter}
                    onChange={(e) => dispatch(setGlobalFilter(e.target.value))}
                    placeholder="Tìm kiếm..."
                />
            </IconField>
            <Button
                icon="pi pi-refresh"
                outlined
                onClick={() => refetch()}
                tooltip="Làm mới"
                tooltipOptions={{ position: "top" }}
                style={{ marginLeft: "0.5rem" }}
            />
        </>
    );

    const header = (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Quản lý người dùng</span>
            <span style={{ color: "var(--text-color-secondary)" }}>{users.length} người dùng</span>
        </div>
    );

    if (isLoading) {
        return (
            <Card>
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                    <ProgressSpinner />
                </div>
            </Card>
        );
    }

    if (error) {
        const errorMessage = error instanceof HttpError
            ? error.userMessage()
            : error.message || "Đã xảy ra lỗi không xác định";

        const isRetryable = error instanceof HttpError ? error.isRetryable() : true;

        return (
            <Card>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem", gap: "1rem" }}>
                    <i
                        className="pi pi-exclamation-triangle"
                        style={{ fontSize: "3rem", color: "var(--red-500)" }}
                    />
                    <h3 style={{ margin: 0, color: "var(--text-color)" }}>
                        Không thể tải dữ liệu
                    </h3>
                    <p style={{ margin: 0, color: "var(--text-color-secondary)", textAlign: "center" }}>
                        {errorMessage}
                    </p>
                    {isRetryable && (
                        <Button
                            label="Thử lại"
                            icon="pi pi-refresh"
                            severity="secondary"
                            outlined
                            onClick={() => refetch()}
                        />
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Toolbar start={startContent} end={endContent} style={{ marginBottom: "1rem", border: "none", padding: 0, background: "transparent" }} />

            <DataTable
                value={users}
                selection={selectedUsers}
                onSelectionChange={onSelectionChange}
                selectionMode="multiple"
                dataKey="id"
                header={header}
                globalFilter={globalFilter}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords}"
                emptyMessage="Không có dữ liệu"
                stripedRows
                showGridlines
                removableSort
                size="small"
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column field="username" header="Username" sortable />
                <Column header="Họ tên" body={nameBodyTemplate} sortable sortField="firstName" />
                <Column field="email" header="Email" sortable />
                <Column
                    header="Trạng thái"
                    body={statusBodyTemplate}
                    sortable
                    sortField="active"
                    align="center"
                    headerStyle={{ width: "10rem" }}
                />
                <Column
                    header="Thao tác"
                    body={actionBodyTemplate}
                    headerStyle={{ width: "10rem" }}
                    align="center"
                />
            </DataTable>
        </Card>
    );
}
