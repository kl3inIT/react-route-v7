import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function AuthCallbackPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            const returnTo = (auth.user?.state as { returnTo?: string })?.returnTo || "/";
            navigate(returnTo, { replace: true });
        }
    }, [auth.isAuthenticated, auth.user?.state, navigate]);

    if (auth.isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-ground)" }}>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <ProgressSpinner />
                    <p style={{ marginTop: "1rem", color: "var(--text-color-secondary)" }}>
                        Đang xử lý đăng nhập...
                    </p>
                </Card>
            </div>
        );
    }

    if (auth.error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-ground)" }}>
                <Card style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}>
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: "3rem", color: "var(--red-500)", marginBottom: "1rem", display: "block" }} />
                    <h2 style={{ margin: "0 0 1rem 0" }}>Lỗi xác thực</h2>
                    <Message severity="error" text={auth.error.message} style={{ marginBottom: "1rem", width: "100%" }} />
                    <Button
                        label="Thử lại"
                        icon="pi pi-refresh"
                        onClick={() => auth.signinRedirect()}
                    />
                </Card>
            </div>
        );
    }

    return null;
}


