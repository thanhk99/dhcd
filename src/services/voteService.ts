import { apiService } from '@/lib/api-client';

export interface OptionVote {
    votingOptionId: string;
    voteWeight?: number;
}

export interface VoteRequest {
    optionVotes: OptionVote[];
}

export interface VotingResultOption {
    votingOptionId: string;
    votingOptionName: string;
    voteCount: number;
    totalWeight: number;
    percentage: number;
}

export interface VotingResult {
    meetingId: string;
    meetingTitle: string;
    resolutionId?: string;
    electionId?: string;
    resolutionTitle?: string;
    electionTitle?: string;
    results: VotingResultOption[];
    totalVoters: number;
    totalWeight: number;
    createdAt: string;
}

export const voteService = {
    voteResolution: async (resolutionId: string, request: VoteRequest): Promise<any> => {
        const response = await apiService.post<any>(`/resolutions/${resolutionId}/vote`, request);
        return response.data;
    },

    voteElection: async (electionId: string, request: VoteRequest): Promise<any> => {
        const response = await apiService.post<any>(`/elections/${electionId}/vote`, request);
        return response.data;
    }
};
