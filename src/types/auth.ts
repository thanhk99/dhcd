export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface AuthUser {
    userId: number;
    username: string;
    email: string;
    roles: string[];
}

export interface LoginResponse extends AuthUser {
    accessToken: string;
}

export interface LogoutResponse {
    message: string;
}
