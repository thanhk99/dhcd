'use server';

import { z } from 'zod';

/**
 * Schema xác thực cho dữ liệu đầu vào.
 * Luôn luôn xác thực tất cả dữ liệu từ Client.
 */
const contactSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    message: z.string().min(10, { message: "Tin nhắn phải có ít nhất 10 ký tự" }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Ví dụ về một Server Action an toàn:
 * 1. Sử dụng 'use server'
 * 2. Xác thực Input với Zod
 * 3. Kiểm tra Authorization (nếu cần)
 * 4. Xử lý dữ liệu an toàn
 */
export async function submitContactForm(data: ContactInput) {
    // 1. Xác thực dữ liệu
    const validatedFields = contactSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 2. Logic xử lý (ví dụ: lưu vào DB hoặc gửi mail)
    console.log("Dữ liệu an toàn đã được xác thực:", validatedFields.data);

    return {
        success: true,
        message: "Gửi thông tin thành công!",
    };
}
