'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, History, FileText, User } from 'lucide-react';
import styles from './BottomNav.module.css';

interface BottomNavProps {
    activeTab?: 'home' | 'history' | 'docs' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => {
    const router = useRouter();
    const tabs = [
        { id: 'home', label: 'Trang chủ', icon: Home, path: '/' },
        { id: 'history', label: 'Lịch sử', icon: History, path: '/history' },
        { id: 'docs', label: 'Tài liệu', icon: FileText, path: '/documents' },
        { id: 'profile', label: 'Cá nhân', icon: User, path: '/profile' },
    ];

    return (
        <nav className={styles.nav}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${isActive ? styles.active : ''}`}
                        onClick={() => router.push(tab.path)}
                    >
                        <Icon size={24} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};
