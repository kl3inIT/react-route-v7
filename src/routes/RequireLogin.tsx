import { useAuth } from "react-oidc-context";
import { Outlet, useLocation } from "react-router";
import { ProgressSpinner } from "primereact/progressspinner";

export function RequireLogin() {
  const auth = useAuth();
  const location = useLocation();

  // Đang loading auth state
  if (auth.isLoading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  // Chưa đăng nhập -> redirect to login
  if (!auth.isAuthenticated) {
    // Lưu lại URL hiện tại để redirect sau khi login
    auth.signinRedirect({ state: { returnTo: location.pathname } });
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center">
          <ProgressSpinner />
          <p className="mt-3 text-500">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}