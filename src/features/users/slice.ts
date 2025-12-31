import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UsersTableState } from "./types";

const initialState: UsersTableState = {
    selectedUsers: [],
    globalFilter: "",
    isCreateDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    editingUser: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setSelectedUsers(state, action: PayloadAction<User[]>) {
            state.selectedUsers = action.payload;
        },
        clearSelectedUsers(state) {
            state.selectedUsers = [];
        },

        setGlobalFilter(state, action: PayloadAction<string>) {
            state.globalFilter = action.payload;
        },

        openCreateDialog(state) {
            state.isCreateDialogOpen = true;
        },
        closeCreateDialog(state) {
            state.isCreateDialogOpen = false;
        },

        openEditDialog(state, action: PayloadAction<User>) {
            state.isEditDialogOpen = true;
            state.editingUser = action.payload;
        },
        closeEditDialog(state) {
            state.isEditDialogOpen = false;
            state.editingUser = null;
        },

        openDeleteDialog(state) {
            state.isDeleteDialogOpen = true;
        },
        closeDeleteDialog(state) {
            state.isDeleteDialogOpen = false;
        },

        resetUsersState() {
            return initialState;
        },
    },
});

export const {
    setSelectedUsers,
    clearSelectedUsers,
    setGlobalFilter,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    resetUsersState,
} = usersSlice.actions;

export default usersSlice.reducer;




