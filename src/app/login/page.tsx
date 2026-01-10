'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Toast } from '@/components/ui/Toast/Toast';
import { loginAction } from '@/actions/auth';
import { tokenManager } from '@/utils/tokenManager';
import { QRScanner } from '@/components/features/QRScanner';

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

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get('token');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
        message: '',
        type: 'success',
        show: false
    });
    const [showScanner, setShowScanner] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            setToast({ message: 'Vui lòng nhập đầy đủ mã cổ đông/CCCD và mật khẩu.', type: 'error', show: true });
            return;
        }

        setIsLoading(true);
        try {
            const result = await loginAction({ identifier, password });

            if (result.success) {
                // Store token in memory for client-side API calls
                if (result.data?.accessToken) {
                    tokenManager.setAccessToken(result.data.accessToken);
                }

                setToast({ message: 'Đăng nhập thành công!', type: 'success', show: true });

                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setToast({ message: result.error || 'Đăng nhập thất bại.', type: 'error', show: true });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setToast({ message: 'Đã xảy ra lỗi. Vui lòng thử lại.', type: 'error', show: true });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const autoLogin = async () => {
            if (tokenParam) {
                setIsLoading(true);
                try {
                    // Import action dynamically or rely on it being available if imported at top
                    const { magicLoginAction } = await import('@/actions/auth');
                    const result = await magicLoginAction(tokenParam);

                    if (result.success) {
                        if (result.data?.accessToken) {
                            tokenManager.setAccessToken(result.data.accessToken);
                        }
                        setToast({ message: 'Đăng nhập tự động thành công!', type: 'success', show: true });
                        setTimeout(() => {
                            router.push('/');
                        }, 1000);
                    } else {
                        setToast({ message: result.error || 'Token đăng nhập không hợp lệ.', type: 'error', show: true });
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Auto login error:', error);
                    setToast({ message: 'Lỗi đăng nhập tự động.', type: 'error', show: true });
                    setIsLoading(false);
                }
            }
        };

        autoLogin();
    }, [tokenParam, router]);

    const handleScanSuccess = async (decodedText: string) => {
        setShowScanner(false);
        try {
            // Try parsing as JSON for direct login (legacy/debug support)
            const parsed = JSON.parse(decodedText);
            if (parsed.identifier && parsed.password) {
                setIdentifier(parsed.identifier);
                setPassword(parsed.password);

                setIsLoading(true);
                try {
                    const result = await loginAction({ identifier: parsed.identifier, password: parsed.password });
                    if (result.success) {
                        if (result.data?.accessToken) {
                            tokenManager.setAccessToken(result.data.accessToken);
                        }
                        setToast({ message: 'Đăng nhập bằng QR thành công!', type: 'success', show: true });
                        setTimeout(() => {
                            router.push('/');
                        }, 1000);
                    } else {
                        setToast({ message: result.error || 'Đăng nhập QR thất bại.', type: 'error', show: true });
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('QR Login error:', error);
                    setToast({ message: 'Lỗi đăng nhập QR.', type: 'error', show: true });
                    setIsLoading(false);
                }
                return;
            }
        } catch (e) {
            // Not JSON
        }

        // If not JSON or standard login failed, try Magic Token Login
        setIsLoading(true);
        // We'll treat the text as a potential magic token first
        // If it's a short numeric code (shareholder code), magic login will likely fail fast on backend
        // or we can optimistically check regex if we knew the format.
        // For now, we try the API.
        try {
            // Needed to import magicLoginAction at the top
            const { magicLoginAction } = await import('@/actions/auth');

            const result = await magicLoginAction(decodedText);

            if (result.success) {
                if (result.data?.accessToken) {
                    tokenManager.setAccessToken(result.data.accessToken);
                }
                setToast({ message: 'Đăng nhập Magic Token thành công!', type: 'success', show: true });
                setTimeout(() => {
                    router.push('/');
                }, 1000);
                return;
            }

            // If magic login failed, fall back to "User scanned a shareholder code" behavior
            // We assume that if it's not a valid token, it might just be the code.
            setIsLoading(false);
            setIdentifier(decodedText);
            setToast({ message: 'Đã nhập mã cổ đông: ' + decodedText, type: 'success', show: true });

        } catch (error) {
            console.error("Magic login attempt error", error);
            setIsLoading(false);
            // Final fallback
            setIdentifier(decodedText);
            setToast({ message: 'Đã nhập mã cổ đông: ' + decodedText, type: 'success', show: true });
        }
    };

    const handleScanFailure = (error: any) => {
        // Optional: handle visual feedback or ignore repeated errors
        // console.warn(error);
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
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className={styles.passwordWrapper}>
                        <Input
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu của bạn"
                            type={showPassword ? 'text' : 'password'}
                            rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            onRightIconClick={togglePassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <Button fullWidth className={styles.submitBtn} type="submit" disabled={isLoading}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>HOẶC ĐĂNG NHẬP BẰNG</span>
                </div>

                <div className={styles.biometric}>
                    <button className={styles.biometricBtn} onClick={() => setShowScanner(true)}>
                        <QrCodeIcon />
                    </button>
                    <p className={styles.biometricLabel}>Quét mã QR</p>
                </div>

                {showScanner && (
                    <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onScanFailure={handleScanFailure}
                        onClose={() => setShowScanner(false)}
                    />
                )}
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LoginForm />
        </Suspense>
    );
}
