import { Toast, type ToastMessage } from "primereact/toast";
import { createContext, useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { toastRef as globalToastRef } from "../services/notification/toast.ts";

type NotificationSeverity = "success" | "info" | "warn" | "error";

interface NotificationOptions {
    detail?: string;
    /** Auto-dismiss timeout in ms. Default: 4000 for success/info/warn, sticky for error */
    life?: number;
    /** If true, notification will not auto-dismiss */
    sticky?: boolean;
}

interface NotificationContextType {
    success: (summary: string, options?: NotificationOptions) => void;
    error: (summary: string, options?: NotificationOptions) => void;
    warn: (summary: string, options?: NotificationOptions) => void;
    info: (summary: string, options?: NotificationOptions) => void;
    show: (message: ToastMessage | ToastMessage[]) => void;
    clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function createNotification(
    severity: NotificationSeverity,
    summary: string,
    options?: NotificationOptions
): ToastMessage {
    const isError = severity === "error";
    return {
        severity,
        summary,
        detail: options?.detail,
        life: options?.sticky ? undefined : (options?.life ?? (isError ? undefined : 4000)),
        sticky: options?.sticky ?? isError,
    };
}

export function NotificationProvider({ children }: PropsWithChildren) {
    const toastRef = useRef<Toast>(null);

    // Sync local ref with global ref for external access
    useEffect(() => {
        if (toastRef.current) {
            (globalToastRef as React.MutableRefObject<Toast | null>).current = toastRef.current;
        }
    }, []);

    const value: NotificationContextType = {
        success: (summary, options) =>
            toastRef.current?.show(createNotification("success", summary, options)),

        error: (summary, options) =>
            toastRef.current?.show(createNotification("error", summary, options)),

        warn: (summary, options) =>
            toastRef.current?.show(createNotification("warn", summary, options)),

        info: (summary, options) =>
            toastRef.current?.show(createNotification("info", summary, options)),

        show: (message) => toastRef.current?.show(message),

        clear: () => toastRef.current?.clear(),
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Toast ref={toastRef} position="top-right" />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return context;
}
