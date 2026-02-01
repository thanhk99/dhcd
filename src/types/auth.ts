export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface AuthUser {
    userId: string;
    username: string;
    email: string;
    roles: string[];
}

export interface LoginResponse extends AuthUser {
    accessToken: string;
    tokenType: string;
    refreshToken?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface LogoutResponse {
    message: string;
}
