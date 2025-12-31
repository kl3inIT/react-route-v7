import type { LoaderFunctionArgs } from "react-router";
import { queryClient } from "@/contexts/queryClient.ts";
import { getUsers } from "@/features/users/api";
import { userKeys } from "@/features/users/hooks";

export async function loader(_args: LoaderFunctionArgs) {

    await queryClient.prefetchQuery({
        queryKey: userKeys.lists(),
        queryFn: getUsers,
        staleTime: 30_000, // 30 seconds - giữ data fresh trong cache
    });

    return {
        prefetched: true,
    };
}

