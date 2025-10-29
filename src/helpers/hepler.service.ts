import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { isAxiosError } from "axios";
import { enviroment } from "src/enviroments/enviroment";

@Injectable({
    providedIn: "root",
})
export class HelperService {
    constructor(private readonly logger: NGXLogger) { }

    /** Lấy base URL từ environment */
    getBaseUrl(): string {
        return enviroment.url;
    }

    /** Hàm xử lý lỗi API */
    ThrowError(error: unknown): Error {
        if (isAxiosError(error)) {
            // Lỗi có response từ backend
            if (error.response) {
                this.logger.error("API Response Error:", {
                    status: error.response.status,
                    url: error.config?.url,
                    data: error.response.data,
                });

                const backendError =
                    error.response.data?.error ||
                    error.response.data?.message ||
                    "Lỗi không xác định từ backend";

                return new Error(backendError);
            }

            // Lỗi không có response (timeout / network)
            if (error.request) {
                this.logger.error("API Request Error (No Response):", {
                    url: error.config?.url,
                    message: error.message,
                });
                return new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau");
            }

            // Lỗi cấu hình Axios
            this.logger.error("API Config Error:", error.message);
            return new Error(`Lỗi cấu hình request: ${error.message}`);
        }

        // Lỗi khác
        this.logger.error("Unknown Error:", error);
        return new Error(
            error instanceof Error ? error.message : "Lỗi không xác định"
        );
    }
}
