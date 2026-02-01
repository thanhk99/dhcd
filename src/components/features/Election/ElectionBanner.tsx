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
    image?: string;
}

export const ElectionBanner: React.FC<ElectionBannerProps> = ({
    status,
    timeLeft,
    title,
    description,
    image,
}) => {
    return (
        <div className={styles.banner}>
            <div className={styles.imageWrapper} style={{ background: image ? 'none' : 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))' }}>
                {image && <img src={image} alt={title} className={styles.image} />}
                <div className={styles.overlay} />
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
