import { http } from "@/api/http";
import type { User, CreateUserDto, UpdateUserDto, UserSearchParams } from "./types";

const RESOURCE = "/rest/entities/User";

export async function getUsers(): Promise<User[]> {
    const response = await http.get<User[]>(RESOURCE);
    return response.data;
}

export async function getUserById(id: string): Promise<User> {
    const response = await http.get<User>(`${RESOURCE}/${id}`);
    return response.data;
}

export async function createUser(data: CreateUserDto): Promise<User> {
    const response = await http.post<User>(RESOURCE, data);
    return response.data;
}

export async function updateUser({ id, ...data }: UpdateUserDto): Promise<User> {
    const response = await http.put<User>(`${RESOURCE}/${id}`, data);
    return response.data;
}

export async function deleteUser(id: string): Promise<void> {
    await http.delete(`${RESOURCE}/${id}`);
}

export async function searchUsers(params: UserSearchParams): Promise<User[]> {
    const response = await http.post<User[]>(`${RESOURCE}/search`, params);
    return response.data;
}




