import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
                <Card className="text-center" style={{ maxWidth: "500px" }}>
                    <i
                        className="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"
                        style={{ display: "block" }}
                    />
                    <h1 className="text-4xl font-bold text-900 mb-2">
                        {error.status}
                    </h1>
                    <h2 className="text-xl text-500 mb-4">{error.statusText}</h2>
                    <p className="text-600 mb-4">{error.data}</p>
                    <Button
                        label="Về trang chủ"
                        icon="pi pi-home"
                        onClick={() => navigate("/")}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
            <Card className="text-center" style={{ maxWidth: "500px" }}>
                <i
                    className="pi pi-times-circle text-6xl text-red-500 mb-4"
                    style={{ display: "block" }}
                />
                <h1 className="text-2xl font-bold text-900 mb-2">
                    Oops! Có lỗi xảy ra
                </h1>
                <p className="text-600 mb-4">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
                <div className="flex gap-2 justify-content-center">
                    <Button
                        label="Thử lại"
                        icon="pi pi-refresh"
                        severity="secondary"
                        outlined
                        onClick={() => window.location.reload()}
                    />
                    <Button
                        label="Về trang chủ"
                        icon="pi pi-home"
                        onClick={() => navigate("/")}
                    />
                </div>
            </Card>
        </div>
    );
}