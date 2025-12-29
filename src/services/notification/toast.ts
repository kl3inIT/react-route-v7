import type { Toast, ToastMessage } from "primereact/toast";
import { createRef } from "react";

/**
 * Global toast ref - used by NotificationProvider
 * This allows calling toast from anywhere (including mutations, loaders, etc.)
 */
export const toastRef = createRef<Toast>();

interface ToastOptions {
    detail?: string;
    life?: number;
    sticky?: boolean;
}

/**
 * Global toast API - can be used outside React components
 * 
 * @example
 * // In a mutation onSuccess
 * toast.success("User created successfully!");
 * 
 * // In a loader
 * toast.error("Failed to load data", { detail: error.message });
 */
export const toast = {
    success: (summary: string, options?: ToastOptions) => {
        toastRef.current?.show({
            severity: "success",
            summary,
            detail: options?.detail,
            life: options?.life ?? 4000,
        });
    },

    error: (summary: string, options?: ToastOptions) => {
        toastRef.current?.show({
            severity: "error",
            summary,
            detail: options?.detail,
            sticky: options?.sticky ?? true,
        });
    },

    warn: (summary: string, options?: ToastOptions) => {
        toastRef.current?.show({
            severity: "warn",
            summary,
            detail: options?.detail,
            life: options?.life ?? 5000,
        });
    },

    info: (summary: string, options?: ToastOptions) => {
        toastRef.current?.show({
            severity: "info",
            summary,
            detail: options?.detail,
            life: options?.life ?? 4000,
        });
    },

    show: (message: ToastMessage | ToastMessage[]) => {
        toastRef.current?.show(message);
    },

    clear: () => {
        toastRef.current?.clear();
    },
};


