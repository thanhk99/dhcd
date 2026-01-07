'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

interface LoginCredentials {
    identifier: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    userId: number;
    username: string;
    email: string;
    roles: string[];
}

export async function loginAction(credentials: LoginCredentials) {
    try {
        const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            credentials,
            {
                withCredentials: true,
            }
        );

        if (response.data.accessToken) {
            // Lưu token vào httpOnly cookie
            const cookieStore = await cookies();
            cookieStore.set('token', response.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return {
                success: true,
                data: {
                    userId: response.data.userId,
                    username: response.data.username,
                    email: response.data.email,
                    roles: response.data.roles,
                },
            };
        }

        return {
            success: false,
            error: 'Không nhận được token từ server',
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.',
        };
    }
}

export async function logoutAction() {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {},
            {
                withCredentials: true,
            }
        );

        const cookieStore = await cookies();
        cookieStore.delete('token');

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Đăng xuất thất bại',
        };
    }
}
