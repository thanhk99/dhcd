'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { ApiResponse } from '@/types/api.types';
import { LoginResponse } from '@/types/auth';
import { API_BASE_URL } from '@/lib/api-client';

interface LoginCredentials {
    identifier: string;
    password: string;
}

export async function loginAction(credentials: LoginCredentials) {
    try {
        const baseUrl = API_BASE_URL;
        const response = await axios.post<LoginResponse>(
            `${baseUrl}/auth/login`,
            credentials,
            {
                withCredentials: true,
            }
        );

        const loginData = response.data;

        if (loginData.accessToken) {
            const cookieStore = await cookies();

            // Lưu accessToken vào cookie (nếu cần cho SSR)
            cookieStore.set('token', loginData.accessToken, {
                httpOnly: true,
                secure: false, // process.env.NODE_ENV === 'production', // Tắt secure để chạy được trên HTTP
                sameSite: 'lax',
                maxAge: 60 * 60, // 1 hour for access token
                path: '/',
            });

            // Lưu refreshToken vào cookie (đảm bảo bảo mật)
            if (loginData.refreshToken) {
                cookieStore.set('refreshToken', loginData.refreshToken, {
                    httpOnly: true,
                    secure: false, // process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: '/',
                });
            }

            return {
                success: true,
                data: loginData,
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
        const baseUrl = API_BASE_URL;
        await axios.post(
            `${baseUrl}/auth/logout`,
            {},
            {
                withCredentials: true,
            }
        );

        const cookieStore = await cookies();
        cookieStore.delete('token');
        cookieStore.delete('refreshToken');

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Đăng xuất thất bại',
        };
    }
}

export async function magicLoginAction(token: string) {
    try {
        const baseUrl = API_BASE_URL;
        // API endpoint defined in requirements: POST /auth/qr/magic-login
        const response = await axios.post<LoginResponse>(
            `${baseUrl}/auth/qr/magic-login`,
            { token },
            {
                withCredentials: true,
            }
        );

        const loginData = response.data;

        if (loginData.accessToken) {
            const cookieStore = await cookies();

            // Store accessToken
            cookieStore.set('token', loginData.accessToken, {
                httpOnly: true,
                secure: false, // process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60, // 1 hour
                path: '/',
            });

            // Store refreshToken
            if (loginData.refreshToken) {
                cookieStore.set('refreshToken', loginData.refreshToken, {
                    httpOnly: true,
                    secure: false, // process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: '/',
                });
            }

            return {
                success: true,
                data: loginData,
            };
        }

        return {
            success: false,
            error: 'Không nhận được token từ server',
        };
    } catch (error: any) {
        // console.error('Magic Login error:', error);
        // Return null data or specific error to indicate this wasn't a valid magic token
        return {
            success: false,
            error: error.response?.data?.message || 'Login failed',
        };
    }
}
