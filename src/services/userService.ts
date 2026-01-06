import apiClient from '@/lib/api-client';

export interface User {
    id: number;
    username: string;
    email: string;
}

/**
 * Service quản lý User từ Spring Boot (Sử dụng Axios)
 */
export const userService = {
    getAllUsers: async () => {
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    },

    getUserById: async (id: number) => {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (data: Partial<User>) => {
        const response = await apiClient.put<User>('/users/profile', data);
        return response.data;
    },
};
