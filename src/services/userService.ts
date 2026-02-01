import { apiService } from '@/lib/api-client';
import { User, UpdateProfileRequest, VoteHistory } from '@/types/user';


export const userService = {

    getCurrentProfile: async (): Promise<User> => {
        const response = await apiService.get<User>('/users/profile');
        return response.data;
    },


    getUserById: async (id: number): Promise<User> => {
        const response = await apiService.get<User>(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await apiService.put<User>('/users/profile', null, {
            params: data
        });
        return response.data;
    },

    getVotingHistory: async (page: number = 0, size: number = 10): Promise<{ content: VoteHistory[], totalPages: number, totalElements: number }> => {
        const response = await apiService.get<any>('/users/me/votes', {
            params: { page, size }
        });

        // Handle direct array response (client-side pagination)
        if (Array.isArray(response.data)) {
            const allItems = response.data;
            const start = page * size;
            const end = start + size;
            return {
                content: allItems.slice(start, end),
                totalPages: Math.ceil(allItems.length / size),
                totalElements: allItems.length
            };
        }

        // Handle wrapped response (server-side pagination)
        return {
            content: response.data?.content || [],
            totalPages: response.data?.totalPages || 0,
            totalElements: response.data?.totalElements || 0
        };
    },

    changePassword: async (data: any): Promise<any> => {
        const response = await apiService.post<any>('/users/change-password', data);
        return response.data;
    },
};
