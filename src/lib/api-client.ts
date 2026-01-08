import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '@/utils/tokenManager';
import { ApiResponse, ApiError } from '@/types/api.types';
import { env } from '@/schemas/env';

// Base API URL
// Prioritize INTERNAL_API_URL if on server side, otherwise use NEXT_PUBLIC_API_URL
const API_BASE_URL = (typeof window === 'undefined' && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
    withCredentials: true, // Important for HttpOnly cookies
});

// Request interceptor - Add access token to headers
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 or 403 and we haven't retried yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('Refreshing token due to 401/403 error...');
                // Call refresh token endpoint - handle flat response
                const response = await axios.post<{ accessToken: string }>(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;
                if (!newAccessToken) throw new Error('Refresh token failed: No access token returned');

                tokenManager.setAccessToken(newAccessToken);

                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Session refresh failed:', refreshError);
                processQueue(refreshError as Error, null);
                tokenManager.clearAccessToken();

                // Optional: Redirect to login if refresh fails
                /*
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                */

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// API Service - Remove ApiResponse wrapper
export const apiService = {
    get: <T>(url: string, config = {}) => {
        return apiClient.get<T>(url, config);
    },

    post: <T>(url: string, data?: unknown, config = {}) => {
        return apiClient.post<T>(url, data, config);
    },

    put: <T>(url: string, data?: unknown, config = {}) => {
        return apiClient.put<T>(url, data, config);
    },

    patch: <T>(url: string, data?: unknown, config = {}) => {
        return apiClient.patch<T>(url, data, config);
    },

    delete: <T>(url: string, config = {}) => {
        return apiClient.delete<T>(url, config);
    },
};

export default apiClient;
