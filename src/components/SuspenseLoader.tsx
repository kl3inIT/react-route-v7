import { Suspense, type ReactNode } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";

interface SuspenseLoaderProps {
    children: ReactNode;
    message?: string;
}

function LoadingFallback({ message = "Đang tải..." }: { message?: string }) {
    return (
        <Card>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem",
                    gap: "1rem",
                }}
            >
                <ProgressSpinner />
                <span style={{ color: "var(--text-color-secondary)" }}>
                    {message}
                </span>
            </div>
        </Card>
    );
}

export function SuspenseLoader({ children, message }: SuspenseLoaderProps) {
    return (
        <Suspense fallback={<LoadingFallback message={message} />}>
            {children}
        </Suspense>
    );
}

