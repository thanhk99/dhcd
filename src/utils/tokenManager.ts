// Token Manager - In-memory storage for access token
let accessToken: string | null = null;

export const tokenManager = {
    getAccessToken: (): string | null => {
        return accessToken;
    },

    setAccessToken: (token: string | null): void => {
        accessToken = token;
    },

    clearAccessToken: (): void => {
        accessToken = null;
    },

    isTokenExpired: (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= exp;
        } catch (error) {
            return true;
        }
    }
};
