import type { QueryClient } from "@tanstack/react-query";
import { getUsersListQueryOptions } from "@/features/users";

export const loader =
    (queryClient: QueryClient) =>
        async () => {
            await queryClient.ensureQueryData(getUsersListQueryOptions());
            return null;
        };
