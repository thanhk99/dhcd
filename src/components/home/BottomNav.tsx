'use client';

import React from 'react';
import { Home, FileCheck, FileText, User } from 'lucide-react';
import styles from './BottomNav.module.css';

interface BottomNavProps {
    activeTab?: 'home' | 'vote' | 'docs' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => {
    const tabs = [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'vote', label: 'Bỏ phiếu', icon: FileCheck },
        { id: 'docs', label: 'Tài liệu', icon: FileText },
        { id: 'profile', label: 'Cá nhân', icon: User },
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
                    >
                        <Icon size={24} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};
