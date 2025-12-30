import { http } from "@/api/http";
import type { User, CreateUserDto, UpdateUserDto, UserSearchParams } from "./types";

const RESOURCE = "/rest/entities/User";

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
    const response = await http.get<User[]>(RESOURCE);
    return response.data;
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<User> {
    const response = await http.get<User>(`${RESOURCE}/${id}`);
    return response.data;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserDto): Promise<User> {
    const response = await http.post<User>(RESOURCE, data);
    return response.data;
}

/**
 * Update an existing user
 */
export async function updateUser({ id, ...data }: UpdateUserDto): Promise<User> {
    const response = await http.put<User>(`${RESOURCE}/${id}`, data);
    return response.data;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<void> {
    await http.delete(`${RESOURCE}/${id}`);
}

/**
 * Search users with filter conditions
 */
export async function searchUsers(params: UserSearchParams): Promise<User[]> {
    const response = await http.post<User[]>(`${RESOURCE}/search`, params);
    return response.data;
}



