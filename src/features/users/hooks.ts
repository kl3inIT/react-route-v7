import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, searchUsers, createUser, updateUser, deleteUser } from "./api";
import { toast } from "@/services/notification";
import { HttpError } from "@/api/HttpError";
import type { User, UserSearchParams, CreateUserDto, UpdateUserDto } from "./types";

// ============================================================================
// Helper: Extract user-friendly error message
// ============================================================================

function getErrorMessage(error: unknown): string {
    if (error instanceof HttpError) {
        return error.userMessage();
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Đã xảy ra lỗi không xác định";
}

// ============================================================================
// Query Keys
// ============================================================================

export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (params?: UserSearchParams) => [...userKeys.lists(), params] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

// ============================================================================
// Queries (GET operations)
// → Lỗi sẽ được xử lý bằng Fallback UI trong component
// ============================================================================

export function useUsers() {
    return useQuery<User[], Error>({
        queryKey: userKeys.lists(),
        queryFn: getUsers,
    });
}

export function useUser(userId: string) {
    return useQuery<User, Error>({
        queryKey: userKeys.detail(userId),
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
}

export function useSearchUsers(params: UserSearchParams) {
    return useQuery<User[], Error>({
        queryKey: userKeys.list(params),
        queryFn: () => searchUsers(params),
    });
}

// ============================================================================
// Mutations (POST/PUT/DELETE operations)
// → Lỗi sẽ được xử lý bằng Toast notification
// ============================================================================

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserDto) => createUser(data),
        onSuccess: (newUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
                old ? [...old, newUser] : [newUser]
            );

            toast.success("Tạo người dùng thành công!", {
                detail: `Đã tạo "${newUser.username}"`,
            });
        },
        onError: (error: unknown) => {
            toast.error("Không thể tạo người dùng", {
                detail: getErrorMessage(error),
            });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserDto) => updateUser(data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData<User>(
                userKeys.detail(updatedUser.id),
                updatedUser
            );

            queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
                old?.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );

            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            toast.success("Cập nhật thành công!", {
                detail: `Đã cập nhật "${updatedUser.username}"`,
            });
        },
        onError: (error: unknown) => {
            toast.error("Không thể cập nhật người dùng", {
                detail: getErrorMessage(error),
            });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: (_, deletedUserId) => {
            queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
                old?.filter((user) => user.id !== deletedUserId)
            );

            queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            toast.success("Xóa người dùng thành công!");
        },
        onError: (error: unknown) => {
            toast.error("Không thể xóa người dùng", {
                detail: getErrorMessage(error),
            });
        },
    });
}

export function useDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userIds: string[]) => {
            await Promise.all(userIds.map((id) => deleteUser(id)));
            return userIds;
        },
        onSuccess: (deletedIds) => {
            queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
                old?.filter((user) => !deletedIds.includes(user.id))
            );

            deletedIds.forEach((id) => {
                queryClient.removeQueries({ queryKey: userKeys.detail(id) });
            });

            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            toast.success(`Đã xóa ${deletedIds.length} người dùng!`);
        },
        onError: (error: unknown) => {
            toast.error("Không thể xóa người dùng", {
                detail: getErrorMessage(error),
            });
        },
    });
}
