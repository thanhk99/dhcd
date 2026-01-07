'use client';

import React from 'react';
import { Timer, Circle } from 'lucide-react';
import styles from './ElectionBanner.module.css';

// ... imports

interface ElectionBannerProps {
    status: string;
    timeLeft: string;
    title: string;
    description: string;
    // imageUrl removed
}

export const ElectionBanner: React.FC<ElectionBannerProps> = ({
    status,
    timeLeft,
    title,
    description,
}) => {
    return (
        <div className={styles.banner}>
            <div className={styles.imageWrapper} style={{ background: 'linear-gradient(to bottom, #1a1a1a, #0c0c0c)' }}>
                {/* Image and overlay removed */}
                <div className={styles.tags}>
                    <div className={styles.statusTag}>
                        <Circle size={10} fill="currentColor" className={styles.pulse} />
                        <span>{status}</span>
                    </div>
                    <div className={styles.timeTag}>
                        <Timer size={14} />
                        <span>{timeLeft}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </div>
            </div>
        </div>
    );
};
