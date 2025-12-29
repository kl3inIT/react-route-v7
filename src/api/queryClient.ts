import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { HttpError } from "./HttpError";

const RETRY_COUNT = 2;
const RETRY_DELAY_BASE = 1000; // 1 second

function getRetryDelay(attemptIndex: number): number {
    return Math.min(RETRY_DELAY_BASE * Math.pow(2, attemptIndex), 30000);
}

function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}

/**
 * Singleton QueryClient instance
 * Used by both QueryProvider and loaders
 */
export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (isHttpError(error)) {
                console.error("[QueryError]", {
                    queryKey: query.queryKey,
                    ...error.toJSON(),
                });
            } else {
                console.error("[UnknownQueryError]", error);
            }
        },
    }),

    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (isHttpError(error)) {
                console.error("[MutationError]", {
                    mutationKey: mutation.options.mutationKey,
                    ...error.toJSON(),
                });
            }
        },
    }),

    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            staleTime: 30_000,

            retry: (failureCount, error) => {
                if (!isHttpError(error)) return false;
                if (failureCount >= RETRY_COUNT) return false;
                return error.isRetryable();
            },

            retryDelay: getRetryDelay,
        },

        mutations: {
            retry: false,
        },
    },
});

