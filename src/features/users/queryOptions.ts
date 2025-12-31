import { queryOptions } from "@tanstack/react-query";
import {
    getUsers,
    getUserById,
    searchUsers,
} from "./api";
import type { User, UserSearchParams } from "./types";

export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (params?: unknown) => [...userKeys.lists(), params] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

export const getUsersListQueryOptions = () =>
    queryOptions<User[]>({
        queryKey:  userKeys.lists(),
        queryFn: getUsers,
    });

export const getUserDetailQueryOption = (id: string) =>
    queryOptions<User>({
        queryKey: userKeys.detail(id),
        queryFn: () => getUserById(id),
        enabled: !!id,
    });

export const searchUsersQuery = (params: UserSearchParams) =>
    queryOptions<User[]>({
        queryKey: userKeys.list(params),
        queryFn: () => searchUsers(params),
    });