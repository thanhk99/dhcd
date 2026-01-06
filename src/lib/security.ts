import crypto from 'crypto';

/**
 * Tạo một token CSRF ngẫu nhiên
 */
export function generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Băm chuỗi dữ liệu nhạy cảm (ví dụ: mật khẩu) sử dụng thuật toán an toàn
 * Lưu ý: Khuyên dùng thư viện chuyên dụng như bcrypt hoặc argon2 trong môi trường thực tế.
 */
export async function hashSensitiveData(data: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(data, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
}

/**
 * Middleware bảo vệ chống tấn công CSRF đơn giản
 */
export function validateCSRFToken(token: string, secret: string): boolean {
    if (!token || !secret) return false;
    return token === secret;
}
