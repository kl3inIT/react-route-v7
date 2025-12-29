import type { PropsWithChildren } from "react";
import { useEffect, useCallback } from "react";
import { AuthProvider as OidcProvider, useAuth } from "react-oidc-context";

import { oidcConfig } from "./oidcConfig";
import { registerAccessToken, unregisterAccessToken } from "./accessTokenProvider";

function AccessTokenRegistration({ children }: PropsWithChildren) {
    const auth = useAuth();

    const getToken = useCallback(async (): Promise<string> => {
        // Nếu user chưa có hoặc đang loading
        if (auth.isLoading) {
            throw new Error("Auth is still loading");
        }

        // Nếu chưa authenticated
        if (!auth.isAuthenticated || !auth.user) {
            throw new Error("User is not authenticated");
        }

        // Kiểm tra token hết hạn
        if (auth.user.expired) {
            try {
                // Thử silent renew
                const user = await auth.signinSilent();
                if (user?.access_token) {
                    return user.access_token;
                }
                throw new Error("Silent renew returned no token");
            } catch (error) {
                // Silent renew failed - cần login lại
                console.error("[Auth] Silent renew failed:", error);
                await auth.signoutRedirect();
                throw new Error("Token expired and silent renew failed");
            }
        }

        return auth.user.access_token;
    }, [auth]);

    useEffect(() => {
        // Chỉ register khi đã authenticated
        if (!auth.isLoading && auth.isAuthenticated && auth.user?.access_token) {
            registerAccessToken(getToken);
        }

        return () => {
            // Cleanup khi unmount hoặc logout
            if (!auth.isAuthenticated) {
                unregisterAccessToken();
            }
        };
    }, [auth.isLoading, auth.isAuthenticated, auth.user?.access_token, getToken]);

    // Hiển thị loading khi auth đang khởi tạo
    if (auth.isLoading) {
        return <div>Loading authentication...</div>;
    }

    return <>{children}</>;
}

export function AuthProvider({ children }: PropsWithChildren) {
    return (
        <OidcProvider {...oidcConfig}>
            <AccessTokenRegistration>
                {children}
            </AccessTokenRegistration>
        </OidcProvider>
    );
}