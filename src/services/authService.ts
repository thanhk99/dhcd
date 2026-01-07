import { apiService } from '@/lib/api-client';
import { LoginResponse, LogoutResponse, LoginRequest } from '@/types/auth';
import { tokenManager } from '@/utils/tokenManager';
import Cookies from 'js-cookie';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiService.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    refreshToken: async (): Promise<LoginResponse> => {
        // Use axios directly to avoid interceptor redirect loops
        const API_BASE_URL = '/api';
        const response = await apiService.post<LoginResponse>(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
        );
        const data = response.data;

        // Store new access token in memory
        tokenManager.setAccessToken(data.accessToken);

        if (data.refreshToken) {
            Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
        }

        return data;
    },

    logout: async (): Promise<LogoutResponse> => {
        const response = await apiService.post<LogoutResponse>('/auth/logout');
        return response.data;
    },
};
