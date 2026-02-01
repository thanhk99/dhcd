'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/home/BottomNav';
import {
    ArrowLeft,
    Pencil,
    CheckCircle,
    Eye,
    EyeOff,
    User as UserIcon,
    Phone,
    Mail,
    Lock,
    History,
    Save,
    PieChart
} from 'lucide-react';
import { userService } from '@/services/userService';
import { logoutAction } from '@/actions/auth';
import { tokenManager } from '@/utils/tokenManager';
import { User } from '@/types/user';
import { Toast } from '@/components/ui/Toast/Toast';
import styles from './Profile.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCCCD, setShowCCCD] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form states
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await userService.getCurrentProfile();
                setUser(profile);
                setFullName(profile.fullName || '');
                setAddress('Số 123, Đường Lê Lợi, Quận 1, TP Hồ Chí Minh'); // Placeholder
                setEmail('nguyenvan.a@example.com'); // Placeholder
                setPhone('901234567'); // Placeholder
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSubmitting(true);
        try {
            await userService.updateProfile({
                fullName: fullName,
                // Add other fields if supported by UpdateProfileRequest
            });
            setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
        } catch (error) {
            console.error('Update failed:', error);
            setToast({ message: 'Có lỗi xảy ra khi cập nhật.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    const handleChangePassword = () => {
        router.push('/profile/change-password');
    };

    const handleLoginHistory = () => {
        router.push('/history');
    };

    if (loading) return <div className={styles.container} style={{ padding: 20, textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className={styles.headerTitle}>Hồ sơ cổ đông</h1>
            </header>

            {/* Profile Hero */}
            <div className={styles.profileHero}>
                <div className={styles.avatarContainer}>
                    <div className={styles.avatar} style={{
                        background: 'var(--cyan-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold'
                    }}>
                        {user?.fullName?.[0]?.toUpperCase() || <UserIcon size={40} />}
                    </div>
                    <button className={styles.editAvatarBtn}>
                        <Pencil size={16} />
                    </button>
                </div>
                <h2 className={styles.userName}>{user?.fullName || 'Nguyễn Văn A'}</h2>
                <div className={styles.statusBadge}>
                    <CheckCircle size={14} color="var(--cyan-accent)" fill="var(--cyan-accent)" style={{ opacity: 0.8 }} />
                    <span>Cổ đông chính thức</span>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Cổ phần sở hữu</span>
                    <div className={styles.statValue}>{(user?.sharesOwned || 0).toLocaleString('vi-VN')}</div>
                    <div className={styles.statIcon}><PieChart size={40} /></div>
                </div>
                <div className={styles.statCard} style={{ background: 'var(--cyan-gradient)', color: 'white' }}>
                    <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>Quyền biểu quyết</span>
                    <div className={styles.statValue}>{(user?.totalShares || 0).toLocaleString('vi-VN')}</div>
                    <div className={styles.statIcon} style={{ opacity: 0.3 }}><CheckCircle size={40} /></div>
                </div>
            </div>

            <div className={styles.statsGrid} style={{ marginBottom: 24 }}>
                <div className={styles.statCard} style={{ padding: 16 }}>
                    <span className={styles.statLabel}>Mã cổ đông</span>
                    <div className={styles.statValue} style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {user?.investorCode || 'SH-889'}
                        <CheckCircle size={16} color="#4CAF50" fill="#4CAF50" />
                    </div>
                </div>
            </div>

            {/* Personal Info Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <UserIcon size={18} color="var(--cyan-accent)" />
                    <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Họ và tên</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ngày sinh</label>
                        <div className={styles.inputWrapper}>
                            <input className={styles.input} type="text" defaultValue="12/05/1985" />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>CCCD/Hộ chiếu</label>
                        <div className={styles.inputWrapper}>
                            <input
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                type={showCCCD ? "text" : "password"}
                                defaultValue={user?.cccd || '00108500xxxx'}
                            />
                            <button className={styles.inputIcon} style={{ background: 'none', border: 'none' }} onClick={() => setShowCCCD(!showCCCD)}>
                                {showCCCD ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Địa chỉ thường trú</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
            </section>

            {/* Contact Info Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Mail size={18} color="var(--cyan-accent)" />
                    <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <div className={styles.inputWrapper}>
                        <input
                            className={`${styles.input} ${styles.inputWithIcon}`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className={styles.inputIcon}><CheckCircle size={18} color="#4CAF50" fill="#4CAF50" /></div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại</label>
                    <div className={styles.formRow} style={{ gridTemplateColumns: '80px 1fr' }}>
                        <div className={styles.inputWrapper}>
                            <div style={{ position: 'absolute', left: 12, display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: 14 }}>🇻🇳</span>
                            </div>
                            <input className={styles.input} style={{ paddingLeft: 36 }} type="text" defaultValue="+84" readOnly />
                        </div>
                        <input
                            className={styles.input}
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Lock size={18} color="var(--cyan-accent)" />
                    <h3 className={styles.sectionTitle}>Bảo mật</h3>
                </div>

                <div className={styles.securityList}>
                    <div className={styles.securityItem} onClick={handleChangePassword}>
                        <div className={styles.securityItemInfo}>
                            <Lock size={20} />
                            <div className={styles.securityItemText}>
                                <h4>Đổi mật khẩu</h4>
                            </div>
                        </div>
                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                    </div>

                    <div className={styles.securityItem} onClick={handleLoginHistory}>
                        <div className={styles.securityItemInfo}>
                            <History size={20} />
                            <div className={styles.securityItemText}>
                                <h4>Lịch sử đăng nhập</h4>
                            </div>
                        </div>
                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className={styles.actionFooter}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Huỷ</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={submitting}>
                    <Save size={18} />
                    <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <BottomNav activeTab="profile" />
        </div>
    );
}
