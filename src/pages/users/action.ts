/**
 * React Router Action Functions
 *
 * Đây là ví dụ minh họa cách sử dụng Form Actions pattern từ React Router
 * kết hợp với React Query (theo TanStack documentation).
 *
 * Khi nào dùng Action Functions:
 * - Simple CRUD operations
 * - Forms không cần complex validation
 * - Muốn progressive enhancement (works without JS)
 *
 * Khi nào dùng useMutation (cách bạn đang dùng):
 * - Complex forms với validation (react-hook-form)
 * - Optimistic updates
 * - Multiple mutations trong 1 form
 * - Fine-grained control over loading/error states
 *
 * Cả hai approaches đều ĐÚNG - chọn theo use case!
 */
import { redirect, type ActionFunctionArgs } from "react-router";
import type { QueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser, userKeys } from "@/features/users";

/**
 * Action: Create User
 * Sử dụng với: <Form method="post" action="/users/new">
 */
export const createAction =
    (queryClient: QueryClient) =>
    async ({ request }: ActionFunctionArgs) => {
        const formData = await request.formData();
        const data = {
            username: formData.get("username") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            active: formData.get("active") === "true",
        };

        const user = await createUser(data);

        // Invalidate queries để refresh list
        await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

        // Redirect sau khi thành công
        return redirect("/users");
    };

/**
 * Action: Update User
 * Sử dụng với: <Form method="put" action="/users/:id/edit">
 */
export const updateAction =
    (queryClient: QueryClient) =>
    async ({ request, params }: ActionFunctionArgs) => {
        if (!params.id) {
            throw new Error("User ID is required");
        }

        const formData = await request.formData();
        const data = {
            id: params.id,
            username: formData.get("username") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            active: formData.get("active") === "true",
        };

        await updateUser(data);

        // Invalidate cả list và detail
        await queryClient.invalidateQueries({ queryKey: userKeys.all });

        return redirect("/users");
    };

/**
 * Action: Delete User
 * Sử dụng với: <Form method="delete" action="/users/:id/destroy">
 */
export const deleteAction =
    (queryClient: QueryClient) =>
    async ({ params }: ActionFunctionArgs) => {
        if (!params.id) {
            throw new Error("User ID is required");
        }

        await deleteUser(params.id);

        // Invalidate và remove query
        queryClient.removeQueries({ queryKey: userKeys.detail(params.id) });
        await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

        return redirect("/users");
    };

/**
 * Ví dụ cách sử dụng trong router.tsx:
 *
 * import { createAction, updateAction, deleteAction } from "@/pages/users/action";
 *
 * {
 *   path: "users/new",
 *   lazy: async () => {
 *     const { default: Component } = await import("@/pages/users/NewUserPage");
 *     return {
 *       Component,
 *       action: createAction(queryClient),
 *     };
 *   },
 * },
 * {
 *   path: "users/:id/edit",
 *   lazy: async () => {
 *     const { default: Component } = await import("@/pages/users/EditUserPage");
 *     return {
 *       Component,
 *       action: updateAction(queryClient),
 *     };
 *   },
 * },
 */

