'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Toast } from '@/components/ui/Toast/Toast';
import { userService } from '@/services/userService';
import styles from './ChangePassword.module.css';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form states
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setToast({ message: 'Vui lòng nhập đầy đủ thông tin.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setToast({ message: 'Mật khẩu mới và xác nhận không khớp.', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setToast({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            await userService.changePassword({
                oldPassword,
                newPassword
            });
            setToast({ message: 'Đổi mật khẩu thành công!', type: 'success' });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
        } catch (error: any) {
            console.error('Change password failed:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.';
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className={styles.headerTitle}>Đổi mật khẩu</h1>
            </header>

            <main className={styles.main}>
                <section className={styles.heroSection}>
                    <h2 className={styles.heroHeading}>Bảo mật tài khoản</h2>
                    <p className={styles.heroText}>
                        Sử dụng mật khẩu mạnh để bảo vệ tài khoản và quyền biểu quyết của bạn.
                    </p>
                </section>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.passwordWrapper}>
                        <Input
                            label="Mật khẩu hiện tại"
                            placeholder="Nhập mật khẩu hiện tại"
                            type={showOld ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            rightIcon={showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                            onRightIconClick={() => setShowOld(!showOld)}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.passwordWrapper}>
                        <Input
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            rightIcon={showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            onRightIconClick={() => setShowNew(!showNew)}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.passwordWrapper}>
                        <Input
                            label="Xác nhận mật khẩu mới"
                            placeholder="Nhập lại mật khẩu mới"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            rightIcon={showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            onRightIconClick={() => setShowConfirm(!showConfirm)}
                            disabled={submitting}
                        />
                    </div>

                    <Button
                        fullWidth
                        className={styles.submitBtn}
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                    </Button>
                </form>

                <div className={styles.requirements}>
                    <h3 className={styles.requirementsTitle}>
                        <ShieldCheck size={18} color="var(--cyan-accent)" />
                        <span>Yêu cầu mật khẩu</span>
                    </h3>
                    <ul className={styles.requirementsList}>
                        <li className={styles.requirementItem}>
                            <div className={styles.requirementIcon}>
                                <CheckCircle2 size={14} color={newPassword.length >= 6 ? "var(--cyan-accent)" : "rgba(255,255,255,0.2)"} />
                            </div>
                            <span>Tối thiểu 6 ký tự</span>
                        </li>
                        <li className={styles.requirementItem}>
                            <div className={styles.requirementIcon}>
                                <CheckCircle2 size={14} color={(newPassword && newPassword === confirmPassword) ? "var(--cyan-accent)" : "rgba(255,255,255,0.2)"} />
                            </div>
                            <span>Khớp với mật khẩu xác nhận</span>
                        </li>
                    </ul>
                </div>
            </main>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
