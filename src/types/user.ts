import { AuthUser } from './auth';

export interface User extends AuthUser {
    id: number;
    fullName: string;
    sharesOwned: number;
    receivedProxyShares: number;
    delegatedShares: number;
    phoneNumber: string;
    investorCode: string;
    cccd: string;
    dateOfIssue: string;
    address: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    email?: string;
}
