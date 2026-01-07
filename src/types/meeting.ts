export interface VotingOption {
    id: string;
    name: string;
    position: string | null;
    bio: string | null;
    photoUrl: string | null;
    displayOrder: number;
}

export interface UserVote {
    votingOptionId: string;
    votingOptionName: string;
    voteWeight: number;
    votedAt: string;
}

export interface Election {
    id: string;
    title: string;
    description: string;
    electionType: string;
    displayOrder: number;
    votingOptions: VotingOption[];
    candidates?: VotingOption[]; // Keep for compatibility if needed
    userVotes: UserVote[];
}

export interface Resolution {
    id: string;
    title: string;
    description: string;
    displayOrder: number;
    votingOptions: VotingOption[];
    resolutionCode?: string;
    userVotes: UserVote[];
}

export interface Meeting {
    id: string;
    meetingCode: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: 'ONGOING' | 'UPCOMING' | 'CLOSED';
    resolutions: Resolution[];
    elections: Election[];
    createdAt: string;
    updatedAt: string;
}
