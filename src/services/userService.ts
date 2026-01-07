import apiClient from '@/lib/api-client';
import { User, UpdateProfileRequest } from '@/types/user';


export const userService = {

    getCurrentProfile: async (): Promise<User> => {
        const response = await apiClient.get<User>('/users/profile');
        return response.data;
    },


    getUserById: async (id: number): Promise<User> => {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await apiClient.put<User>('/users/profile', null, {
            params: data
        });
        return response.data;
    },
};
