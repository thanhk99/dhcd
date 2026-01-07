'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import styles from './ElectionHeader.module.css';

interface ElectionHeaderProps {
    title: string;
}

export const ElectionHeader: React.FC<ElectionHeaderProps> = ({ title }) => {
    const router = useRouter();

    return (
        <header className={styles.header}>
            <button
                className={styles.backButton}
                onClick={() => router.back()}
                aria-label="Back"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.placeholder} />
        </header>
    );
};
