'use client';

import React from 'react';
import { BottomNav } from '@/components/home/BottomNav';
import { FileText, Download } from 'lucide-react';
import styles from '../shared-pages.module.css';

export default function DocumentsPage() {
    const documents = [
        { id: 1, title: 'Báo cáo tài chính năm 2023', size: '2.4 MB' },
        { id: 2, title: 'Tờ trình Đại hội đồng cổ đông', size: '1.1 MB' },
        { id: 3, title: 'Quy chế biểu quyết trực tuyến', size: '0.8 MB' },
        { id: 4, title: 'Danh sách ứng viên HĐQT', size: '1.5 MB' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Tài liệu</h1>
                <p className={styles.subtitle}>Tài liệu liên quan đến các cuộc họp</p>
            </header>

            <main>
                {documents.map(doc => (
                    <div key={doc.id} className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--cyan-accent)' }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className={styles.cardTitle}>{doc.title}</h3>
                                <p className={styles.cardDesc}>{doc.size}</p>
                            </div>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </main>

            <BottomNav activeTab="docs" />
        </div>
    );
}
