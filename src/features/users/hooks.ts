import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "./api";
import { toast } from "@/services/notification";
import { HttpError } from "@/api/HttpError";
import type { User, UserSearchParams, CreateUserDto, UpdateUserDto } from "./types";
import {
    getUsersListQueryOptions,
    getUserDetailQueryOption,
    searchUsersQuery,
    userKeys,
} from "./queryOptions";

function getErrorMessage(error: unknown): string {
    if (error instanceof HttpError) {
        return error.userMessage();
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Đã xảy ra lỗi không xác định";
}

// ============ Standard Query Hooks (with loading/error states) ============
export function useGetListUsers() {
    return useQuery(getUsersListQueryOptions());
}

export function useGetUserById(id: string) {
    return useQuery(getUserDetailQueryOption(id));
}

export function useSearchUsers(params: UserSearchParams) {
    return useQuery(searchUsersQuery(params));
}

// ============ Suspense Query Hooks (for use with Suspense boundary) ============
// Data is guaranteed - no loading/error handling needed in component
export function useSuspenseGetListUsers() {
    return useSuspenseQuery(getUsersListQueryOptions());
}

export function useSuspenseGetUserById(id: string) {
    return useSuspenseQuery(getUserDetailQueryOption(id));
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserDto) => createUser(data),
        onSuccess: (newUser) => {
            void queryClient.invalidateQueries({ queryKey: userKeys.lists() });

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

            void queryClient.invalidateQueries({ queryKey: userKeys.lists() });

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
            void queryClient.invalidateQueries({ queryKey: userKeys.lists() });

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

            void queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            toast.success(`Đã xóa ${deletedIds.length} người dùng!`);
        },
        onError: (error: unknown) => {
            toast.error("Không thể xóa người dùng", {
                detail: getErrorMessage(error),
            });
        },
    });
}
