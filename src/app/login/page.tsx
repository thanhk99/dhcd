'use client';

import { useState } from 'react';

import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Toast } from '@/components/ui/Toast/Toast';



const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);



const QrCodeIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
    </svg>
);

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
        message: '',
        type: 'success',
        show: false
    });

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Giả lập logic đăng nhập
        const isSuccess = Math.random() > 0.5; // Demo ngẫu nhiên

        if (isSuccess) {
            setToast({ message: 'Đăng nhập thành công!', type: 'success', show: true });
        } else {
            setToast({ message: 'Đăng nhập thất bại. Vui lòng kiểm tra lại.', type: 'error', show: true });
        }
    };

    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton}>
                    <ChevronLeft />
                </button>
                <h1 className={styles.title}>Đăng nhập</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                </div>

                <section className={styles.heroSection}>
                    <h2 className={styles.heroHeading}>Cổng Bầu Cử Cổ Đông</h2>
                    <p className={styles.heroText}>
                        Đăng nhập để xem quyền biểu quyết và tham gia đại hội.
                    </p>
                </section>

                <form className={styles.form} onSubmit={handleLogin}>
                    <Input
                        label="Mã cổ đông / CCCD"
                        placeholder="Nhập mã cổ đông hoặc CCCD"
                        icon={<UserIcon />}
                    />

                    <div className={styles.passwordWrapper}>
                        <Input
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu của bạn"
                            type={showPassword ? 'text' : 'password'}
                            rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            onRightIconClick={togglePassword}
                        />
                    </div>

                    <Button fullWidth className={styles.submitBtn} type="submit">
                        Đăng nhập
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>HOẶC ĐĂNG NHẬP BẰNG</span>
                </div>

                <div className={styles.biometric}>
                    <button className={styles.biometricBtn}>
                        <QrCodeIcon />
                    </button>
                    <p className={styles.biometricLabel}>Quét mã QR</p>
                </div>
            </main>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </div>
    );
}
