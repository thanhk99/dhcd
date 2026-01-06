import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/schemas/env';

/**
 * Tạo một Axios Instance với cấu hình mặc định
 */
export const apiClient = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: Tự động đính kèm JWT Token vào Header
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Xử lý lỗi tập trung (401, 403, 500...)
 */
apiClient.interceptors.response.use(
    (response) => response,
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
