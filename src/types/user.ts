import { AuthUser } from './auth';

export interface Delegation {
    id: number;
    delegatorId: string;
    delegatorName: string;
    proxyId: string;
    proxyName: string;
    sharesDelegated: number;
    authorizationDocument: string | null;
    status: string;
    createdAt: string;
    revokedAt: string | null;
}

export interface User extends AuthUser {
    id: number;
    fullName: string;
    sharesOwned: number;
    receivedProxyShares: number;
    delegatedShares: number;
    totalShares: number;
    phoneNumber: string;
    investorCode: string;
    cccd: string;
    dateOfIssue: string;
    placeOfIssue: string | null;
    address: string;
    roles: string[];
    delegationsMade: Delegation[];
    delegationsReceived: Delegation[];
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    email?: string;
}
