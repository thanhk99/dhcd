'use client';

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import styles from './MeetingCard.module.css';

interface MeetingCardProps {
    title: string;
    time: string;
    location: string;
    address: string;
    image?: string;
    countdown?: string;
    onVote?: () => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
    title,
    time,
    location,
    address,
    image,
    countdown,
    onVote,
}) => {
    return (
        <div className={styles.card}>
            {image && (
                <div className={styles.thumbnailContainer}>
                    <img src={image} alt={title} className={styles.thumbnailImage} />
                </div>
            )}
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>

                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <Calendar className={styles.icon} size={20} />
                        <div>
                            <p className={styles.label}>Thời gian</p>
                            <p className={styles.value}>{time}</p>
                            {countdown && <p className={styles.countdown}>{countdown}</p>}
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <MapPin className={styles.icon} size={20} />
                        <div>
                            <p className={styles.label}>Địa điểm</p>
                            <p className={styles.value}>{location}</p>
                            <p className={styles.address}>{address}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.voteButton} onClick={onVote}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Bỏ phiếu ngay
                    </button>
                </div>
            </div>
        </div>
    );
};
