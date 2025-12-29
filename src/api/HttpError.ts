import type { AxiosRequestConfig } from "axios";

export interface JmixErrorPayload {
    error: string;
    details?: string;
}

export class HttpError extends Error {
    public readonly request?: AxiosRequestConfig;
    public readonly status: number;
    public readonly details?: string;
    public readonly errorCode?: string;

    constructor(
        request: AxiosRequestConfig | undefined,
        status: number,
        payload: JmixErrorPayload
    ) {
        super(payload.details || payload.error || `HTTP ${status}`);
        this.name = "HttpError";
        this.request = request;
        this.status = status;
        this.details = payload.details;
        this.errorCode = payload.error;

        Object.setPrototypeOf(this, HttpError.prototype);
    }

    isHard(): boolean {
        return this.status === 401 || this.status >= 500;
    }

    isRetryable(): boolean {
        return [0, 429, 502, 503, 504].includes(this.status);
    }


    isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }


    isServerError(): boolean {
        return this.status >= 500;
    }

    userMessage(): string {
        switch (this.status) {
            case 400:
                return "Dữ liệu không hợp lệ";
            case 401:
                return "Phiên đăng nhập đã hết hạn";
            case 403:
                return "Bạn không có quyền truy cập";
            case 404:
                return "Không tìm thấy dữ liệu";
            case 409:
                return "Dữ liệu đã tồn tại hoặc xung đột";
            case 422:
                return "Dữ liệu không thể xử lý";
            case 429:
                return "Quá nhiều yêu cầu, vui lòng thử lại sau";
            case 500:
                return "Lỗi máy chủ, vui lòng thử lại sau";
            case 502:
            case 503:
            case 504:
                return "Dịch vụ tạm thời không khả dụng";
            case 0:
                return "Không thể kết nối tới máy chủ";
            default:
                return this.details || "Đã xảy ra lỗi, vui lòng thử lại";
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            errorCode: this.errorCode,
            details: this.details,
            url: this.request?.url,
            method: this.request?.method,
        };
    }
}
