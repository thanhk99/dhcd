import apiClient from '@/lib/api-client';
import { LoginResponse, LogoutResponse, LoginRequest } from '@/types/auth';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    refresh: async (): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/refresh');
        return response.data;
    },

    logout: async (): Promise<LogoutResponse> => {
        const response = await apiClient.post<LogoutResponse>('/auth/logout');
        return response.data;
    },
};
