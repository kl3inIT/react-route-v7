import { useAuth } from "react-oidc-context";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function ProfilePage() {
    const auth = useAuth();
    const user = auth.user?.profile;

    const infoItems = [
        { label: "Username", value: user?.preferred_username, icon: "pi-user" },
        { label: "Email", value: user?.email, icon: "pi-envelope" },
        { label: "Họ", value: user?.family_name, icon: "pi-id-card" },
        { label: "Tên", value: user?.given_name, icon: "pi-id-card" },
        { label: "Email đã xác thực", value: user?.email_verified ? "Đã xác thực" : "Chưa xác thực", icon: "pi-verified", isTag: true },
    ];

    const handleLogout = () => {
        auth.signoutRedirect();
    };

    const handleChangePassword = () => {
        // Redirect to Keycloak account page for password change
        const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
        const realm = import.meta.env.VITE_KEYCLOAK_REALM;
        if (keycloakUrl && realm) {
            window.open(`${keycloakUrl}/realms/${realm}/account/#/security/signingin`, "_blank");
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-900 mb-4">Thông tin cá nhân</h1>

            <div className="grid">
                {/* Profile Card */}
                <div className="col-12 lg:col-4">
                    <Card>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                            <Avatar
                                label={user?.name?.charAt(0).toUpperCase() || "U"}
                                size="xlarge"
                                shape="circle"
                                style={{
                                    width: "6rem",
                                    height: "6rem",
                                    fontSize: "2.5rem",
                                    backgroundColor: "var(--primary-color)",
                                    color: "var(--primary-color-text)",
                                }}
                            />
                            <div style={{ textAlign: "center" }}>
                                <h2 style={{ margin: "0 0 0.5rem 0" }}>{user?.name || "User"}</h2>
                                <p style={{ margin: 0, color: "var(--text-color-secondary)" }}>
                                    {user?.email}
                                </p>
                            </div>
                            <Tag
                                value={user?.email_verified ? "Email đã xác thực" : "Email chưa xác thực"}
                                severity={user?.email_verified ? "success" : "warning"}
                                icon={user?.email_verified ? "pi pi-check" : "pi pi-exclamation-triangle"}
                            />
                        </div>
                    </Card>
                </div>

                {/* Details Card */}
                <div className="col-12 lg:col-8">
                    <Card title="Chi tiết tài khoản">
                        {infoItems.map((item, index) => (
                            <div key={item.label}>
                                <div style={{ display: "flex", alignItems: "center", padding: "0.75rem 0" }}>
                                    <i
                                        className={`pi ${item.icon}`}
                                        style={{
                                            width: "2rem",
                                            color: "var(--primary-color)",
                                            fontSize: "1.25rem",
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: "var(--text-color-secondary)", fontSize: "0.875rem" }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontWeight: 500, marginTop: "0.25rem" }}>
                                            {item.isTag ? (
                                                <Tag
                                                    value={item.value || "N/A"}
                                                    severity={item.value === "Đã xác thực" ? "success" : "warning"}
                                                />
                                            ) : (
                                                item.value || "Chưa cập nhật"
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {index < infoItems.length - 1 && <Divider style={{ margin: 0 }} />}
                            </div>
                        ))}
                    </Card>

                    {/* Actions Card */}
                    <Card title="Bảo mật" style={{ marginTop: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Đổi mật khẩu</div>
                                    <div style={{ color: "var(--text-color-secondary)", fontSize: "0.875rem" }}>
                                        Thay đổi mật khẩu đăng nhập của bạn
                                    </div>
                                </div>
                                <Button
                                    label="Đổi mật khẩu"
                                    icon="pi pi-key"
                                    outlined
                                    onClick={handleChangePassword}
                                />
                            </div>

                            <Divider style={{ margin: 0 }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Đăng xuất</div>
                                    <div style={{ color: "var(--text-color-secondary)", fontSize: "0.875rem" }}>
                                        Đăng xuất khỏi tất cả thiết bị
                                    </div>
                                </div>
                                <Button
                                    label="Đăng xuất"
                                    icon="pi pi-sign-out"
                                    severity="danger"
                                    outlined
                                    onClick={handleLogout}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}




