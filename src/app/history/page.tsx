'use client';

import React from 'react';
import { BottomNav } from '@/components/home/BottomNav';
import styles from '../shared-pages.module.css';

export default function HistoryPage() {
    const historyItems = [
        { id: 1, title: 'ĐHĐCĐ Thường niên 2024', date: '25/04/2024', status: 'Đã hoàn thành' },
        { id: 2, title: 'Lấy ý kiến cổ đông bằng văn bản', date: '15/01/2024', status: 'Đã hoàn thành' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Lịch sử</h1>
                <p className={styles.subtitle}>Các hoạt động biểu quyết và họp đã tham gia</p>
            </header>

            <main>
                {historyItems.map(item => (
                    <div key={item.id} className={styles.card}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDesc}>Ngày: {item.date}</p>
                        <p className={styles.cardDesc} style={{ color: 'var(--cyan-accent)', marginTop: '4px' }}>{item.status}</p>
                    </div>
                ))}
            </main>

            <BottomNav activeTab="history" />
        </div>
    );
}
