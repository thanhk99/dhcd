'use client';

import React from 'react';
import { FileText, Volume2, Info } from 'lucide-react';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
    type: 'important' | 'guide' | 'info';
    badge?: string;
    title: string;
    description: string;
    timestamp: string;
}

const iconMap = {
    important: Volume2,
    guide: FileText,
    info: Info,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
    type,
    badge,
    title,
    description,
    timestamp,
}) => {
    const Icon = iconMap[type];

    return (
        <div className={styles.item}>
            <div className={styles.iconWrapper}>
                <Icon size={20} />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    {badge && <span className={styles.badge}>{badge}</span>}
                    <span className={styles.timestamp}>{timestamp}</span>
                </div>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};
