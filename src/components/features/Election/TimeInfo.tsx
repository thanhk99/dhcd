import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './TimeInfo.module.css';

interface TimeCardProps {
    label: string;
    time: string;
    date: string;
    icon: 'start' | 'end';
}

const TimeCard: React.FC<TimeCardProps> = ({ label, time, date, icon }) => {
    return (
        <div className={styles.card}>
            <div className={styles.labelWrapper}>
                {icon === 'start' ? (
                    <Calendar size={18} className={styles.startIcon} />
                ) : (
                    <Calendar size={18} className={styles.endIcon} />
                )}
                <span className={styles.label}>{label}</span>
            </div>
            <div className={styles.time}>{time}</div>
            <div className={styles.date}>{date}</div>
        </div>
    );
};

export const TimeInfo: React.FC<{ startTime?: string; endTime?: string }> = ({ startTime, endTime }) => {
    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return { time: '--:--', date: '--/--/----' };
        const d = new Date(dateStr);
        return {
            time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
    };

    const start = formatDateTime(startTime);
    const end = formatDateTime(endTime);

    return (
        <div className={styles.container}>
            <TimeCard
                label="BẮT ĐẦU"
                time={start.time}
                date={start.date}
                icon="start"
            />
            <TimeCard
                label="KẾT THÚC"
                time={end.time}
                date={end.date}
                icon="end"
            />
        </div>
    );
};
