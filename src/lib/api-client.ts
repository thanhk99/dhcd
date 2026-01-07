import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/schemas/env';

/**
 * Tạo một Axios Instance với cấu hình mặc định
 */
export const apiClient = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: Cookies sẽ được tự động gửi với withCredentials: true
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Token sẽ được gửi tự động qua cookies, không cần thêm vào header
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Xử lý lỗi tập trung (401, 403, 500...)
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized) - Thường là JWT hết hạn
        if (error.response?.status === 401 && originalRequest) {
            console.error('Token hết hạn hoặc không hợp lệ. Điều hướng đến trang Login...');
            // Logic Refresh Token hoặc Redirect Login có thể thêm ở đây
            /*
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            */
        }

        // Xử lý lỗi 403 (Forbidden) - Không có quyền
        if (error.response?.status === 403) {
            console.error('Bạn không có quyền thực hiện hành động này.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
