export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
}

export interface CreateUserDto {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    active?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
    id: string;
}

export interface UserSearchParams {
    filter?: {
        conditions: Array<{
            property: string;
            operator: "=" | "contains" | "startsWith" | "endsWith" | ">" | "<" | ">=" | "<=";
            value: string | number | boolean;
        }>;
    };
    limit?: number;
    offset?: number;
    sort?: string;
}

export interface UsersTableState {
    selectedUsers: User[];
    globalFilter: string;
    isCreateDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    editingUser: User | null;
}


