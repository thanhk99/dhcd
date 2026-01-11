'use client';

import React, { useEffect, useState } from 'react';
import { BottomNav } from '@/components/home/BottomNav';
import { userService } from '@/services/userService';
import { VoteHistory } from '@/types/user';
import styles from '../shared-pages.module.css';

export default function HistoryPage() {
    const [historyItems, setHistoryItems] = useState<VoteHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const pageSizeOptions = [5, 10, 20, 50];

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await userService.getVotingHistory(page, pageSize);
                setHistoryItems(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [page, pageSize]);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(0);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Lịch sử biểu quyết</h1>
                <p className={styles.subtitle}>
                    {totalElements > 0 ? `Tổng cộng ${totalElements} hoạt động` : 'Các hoạt động biểu quyết và họp đã tham gia'}
                </p>
            </header>

            <main>
                {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải...</p>}

                {!loading && historyItems.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                        Chưa có lịch sử biểu quyết nào.
                    </p>
                )}

                {!loading && historyItems.map((item, index) => (
                    <div key={`${item.voteId}-${index}`} className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div className={styles.statusBadge}>
                                {item.action === 'VOTE_CAST' ? 'Đã biểu quyết' : item.action}
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {new Date(item.votedAt).toLocaleString('vi-VN')}
                            </span>
                        </div>

                        <h3 className={styles.cardTitle} style={{ fontSize: '16px', color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                            {item.votingOptionName}
                        </h3>

                        <p className={styles.cardDesc} style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '12px' }}>
                            {item.resolutionTitle}
                        </p>

                        <div className={styles.historyMeta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Số quyền:</span>
                                <span className={styles.metaValue}>{item.voteWeight.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Phiên họp:</span>
                                <span className={styles.metaValue}>{item.meetingTitle}</span>
                            </div>
                        </div>

                        <div className={styles.technicalInfo}>
                            <p>IP: {item.ipAddress}</p>
                            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                Thiết bị: {item.userAgent}
                            </p>
                        </div>
                    </div>
                ))}

                {totalElements > 0 && (
                    <div className={styles.paginationContainer}>
                        <div className={styles.pageSizeSelector}>
                            <span>Hiển thị:</span>
                            <select value={pageSize} onChange={handlePageSizeChange} className={styles.select}>
                                {pageSizeOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <span>/ trang</span>
                        </div>

                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className={`${styles.paginationBtn} ${styles.prevNextBtn}`}
                            >
                                Trước
                            </button>

                            <div className={styles.pageNumbers}>
                                {Array.from({ length: totalPages }, (_, i) => {
                                    if (
                                        i === 0 ||
                                        i === totalPages - 1 ||
                                        (i >= page - 1 && i <= page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`${styles.pageNumber} ${page === i ? styles.activePage : ''}`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    }

                                    if (i === 1 || i === totalPages - 2) {
                                        return <span key={i} className={styles.ellipsis}>...</span>;
                                    }

                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                                className={`${styles.paginationBtn} ${styles.prevNextBtn}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <BottomNav activeTab="history" />
        </div>
    );
}
