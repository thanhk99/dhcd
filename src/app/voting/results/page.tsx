'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    FileText,
    CheckCircle2,
    User2,
    ChevronRight,
    Check,
    Archive
} from 'lucide-react';
import { ProcessHeader } from '@/components/features/Election/ProcessHeader';
import { BottomNav } from '@/components/home/BottomNav';
import styles from './ResultsPage.module.css';

export default function ResultsPage() {
    const router = useRouter();

    const candidates = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            role: 'Chủ tịch HĐQT',
            votes: 806,
            percent: 65,
            elected: true,
            color: '#00BFFF'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            role: 'Thành viên độc lập',
            votes: 310,
            percent: 25,
            elected: false,
            color: '#444'
        },
        {
            id: 3,
            name: 'Phiếu trắng',
            role: 'Không có ý kiến',
            votes: 124,
            percent: 10,
            elected: false,
            color: '#444',
            isBlank: true
        }
    ];

    const historyItems = [
        {
            id: 1,
            title: 'Bầu cử BKS 2023',
            date: '10/01/2023 • Đã kết thúc',
            icon: <Archive size={18} />
        },
        {
            id: 2,
            title: 'Ý kiến cổ đông Q4',
            date: '15/11/2022 • Đã kết thúc',
            icon: <FileText size={18} />
        }
    ];

    return (
        <div className={styles.container}>
            <ProcessHeader
                title="Kết quả bầu cử"
                currentStep={4}
                totalSteps={4}
                onBack={() => router.back()}
            />

            <main className={styles.content}>
                <div className={styles.banner}>
                    <div className={styles.statusBadge}>
                        <CheckCircle2 size={12} />
                        Đã hoàn thành
                    </div>
                    <h1 className={styles.bannerTitle}>
                        Bầu cử HĐQT nhiệm kỳ<br />2024-2029
                    </h1>
                    <p className={styles.bannerDesc}>
                        Kết thúc: 15/05/2024 • 14:30
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Tổng quan</h2>
                    <div className={styles.overviewCard}>
                        <div className={styles.chartContainer}>
                            <svg className={styles.chart} viewBox="0 0 36 36">
                                <path
                                    className={styles.circleBg}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#333"
                                    strokeWidth="3"
                                />
                                <path
                                    className={styles.circle}
                                    strokeDasharray="65, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#00BFFF"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    className={styles.circle2}
                                    strokeDasharray="25, 100"
                                    strokeDashoffset="-65"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#555"
                                    strokeWidth="3"
                                />
                                <path
                                    className={styles.circle3}
                                    strokeDasharray="10, 100"
                                    strokeDashoffset="-90"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#444"
                                    strokeWidth="3"
                                />
                            </svg>
                            <div className={styles.chartInner}>
                                <span className={styles.totalLabel}>Tổng phiếu</span>
                                <span className={styles.totalVotes}>1,240</span>
                                <span className={styles.participation}>100% tham gia</span>
                            </div>
                        </div>

                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <span className={styles.dot} style={{ backgroundColor: '#00BFFF' }}></span>
                                <span className={styles.label}>Đồng ý</span>
                                <span className={styles.percent}>65%</span>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.dot} style={{ backgroundColor: '#555' }}></span>
                                <span className={styles.label}>Không đ.ý</span>
                                <span className={styles.percent}>25%</span>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.dot} style={{ backgroundColor: '#444' }}></span>
                                <span className={styles.label}>Trắng</span>
                                <span className={styles.percent}>10%</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Chi tiết ứng cử viên</h2>
                        <span className={styles.viewAll}>Xem chi tiết</span>
                    </div>

                    {candidates.map(candidate => (
                        <div
                            key={candidate.id}
                            className={`${styles.candidateCard} ${candidate.elected ? styles.elected : ''}`}
                        >
                            <div className={styles.candidateHeader}>
                                <div className={styles.candidateInfo}>
                                    {!candidate.isBlank ? (
                                        <div className={styles.avatar}>
                                            <User2 size={24} color="#888" style={{ margin: 10 }} />
                                        </div>
                                    ) : (
                                        <div className={styles.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Archive size={20} color="#888" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={styles.candidateName}>{candidate.name}</h3>
                                        <p className={styles.candidateRole}>{candidate.role}</p>
                                    </div>
                                </div>
                                <div className={styles.voteCount}>
                                    <span className={styles.countNum}>{candidate.votes}</span>
                                    <span className={styles.countLabel}>Phiếu bầu</span>
                                </div>
                            </div>

                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${candidate.percent}%`,
                                        backgroundColor: candidate.elected ? '#00BFFF' : '#333'
                                    }}
                                />
                            </div>

                            <div className={styles.cardFooter}>
                                <span className={styles.footerPercent}>{candidate.percent}%</span>
                                {candidate.elected && (
                                    <div className={styles.electedBadge}>
                                        <Check size={14} />
                                        Trúng cử
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Lịch sử bầu cử</h2>
                        <span className={styles.viewAll}>Xem tất cả</span>
                    </div>
                    <div className={styles.historyList}>
                        {historyItems.map(item => (
                            <div key={item.id} className={styles.historyItem}>
                                <div className={styles.iconBox}>
                                    {item.icon}
                                </div>
                                <div className={styles.itemInfo}>
                                    <h4 className={styles.itemTitle}>{item.title}</h4>
                                    <p className={styles.itemDate}>{item.date}</p>
                                </div>
                                <ChevronRight size={20} color="#555" />
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav activeTab="home" />
        </div>
    );
}
