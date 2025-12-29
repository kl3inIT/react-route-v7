import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getIsAuthReady } from "../services/auth/accessTokenProvider";
import { HttpError } from "./HttpError";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: Thêm Authorization header
http.interceptors.request.use(
    async (config) => {
        if (!getIsAuthReady()) {
            console.warn("[HTTP] Auth not ready, skipping token");
            return config;
        }

        try {
            const token = await getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn("[HTTP] Failed to get access token:", error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor với retry logic
http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Xử lý 401 - thử refresh token và retry
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = await getAccessToken();
                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return http(originalRequest);
                }
            } catch (refreshError) {
                console.error("[HTTP] Token refresh failed:", refreshError);
            }
        }

        // Network error hoặc timeout (không có response)
        if (!error.response) {
            const isTimeout = error.code === "ECONNABORTED";
            throw new HttpError(error.config, 0, {
                error: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
                details: isTimeout
                    ? "Yêu cầu đã hết thời gian chờ"
                    : "Không thể kết nối tới máy chủ",
            });
        }

        const { status, data, config } = error.response;
        const responseData = data as Record<string, unknown>;

        // Jmix/OAuth error format
        if (responseData?.error) {
            throw new HttpError(config, status, {
                error: String(responseData.error),
                details: String(responseData.details || responseData.error_description || ""),
            });
        }

        // OAuth error format
        if (responseData?.error_description) {
            throw new HttpError(config, status, {
                error: String(responseData.error) || "OAUTH_ERROR",
                details: String(responseData.error_description),
            });
        }

        // Generic error
        throw new HttpError(config, status, {
            error: `HTTP_${status}`,
            details: typeof data === "string" ? data : undefined,
        });
    }
);

export default http;