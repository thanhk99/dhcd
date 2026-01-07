import { apiService } from '@/lib/api-client';
import { Meeting } from '@/types/meeting';

export const meetingService = {
    getOngoingMeeting: async (): Promise<Meeting> => {
        const response = await apiService.get<Meeting>('/meetings/ongoing');
        return response.data;
    },
};
