'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Home, Eye } from 'lucide-react';
import { ProcessHeader } from '@/components/features/Election/ProcessHeader';
import { BottomNav } from '@/components/home/BottomNav';
import { meetingService } from '@/services/meetingService';
import { Meeting } from '@/types/meeting';
import styles from './SuccessPage.module.css';

export default function VoteSuccessPage() {
    const router = useRouter();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await meetingService.getOngoingMeeting();
                setMeeting(data);

                // Get current time in format DD/MM/YYYY HH:mm:ss
                const now = new Date();
                const timeStr = now.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                setCurrentTime(timeStr);
            } catch (error) {
                console.error('Failed to fetch meeting:', error);
            }
        };
        fetchData();
    }, []);

    const resolutionCount = meeting?.resolutions?.length || 0;
    const hasBoardOfDirectors = meeting?.elections?.some(e => e.electionType === 'BOARD_OF_DIRECTORS');
    const hasSupervisoryBoard = meeting?.elections?.some(e => e.electionType === 'SUPERVISORY_BOARD');

    const electionText = [
        hasBoardOfDirectors ? 'HĐQT' : '',
        hasSupervisoryBoard ? 'BKS' : ''
    ].filter(Boolean).join('/');

    return (
        <div className={styles.container}>
            <ProcessHeader
                title="Xác nhận"
                currentStep={3}
                totalSteps={4}
                onCancel={() => router.push('/')}
            />

            <main className={styles.content}>
                <div className={styles.successIcon}>
                    <Check size={50} color="#fff" strokeWidth={3} />
                </div>

                <h2 className={styles.title}>Bỏ phiếu thành công!</h2>

                <div className={styles.infoBox}>
                    <p>
                        Bạn đã hoàn thành biểu quyết cho <span className={styles.highlight}>{resolutionCount} tờ trình</span>
                        {electionText && (
                            <> và bầu cử <span className={styles.highlight}>{electionText}</span></>
                        )}. Cảm ơn quý cổ đông đã tham gia đóng góp ý kiến.
                    </p>
                </div>

                <p className={styles.transactionTime}>
                    Thời gian xác nhận giao dịch: {currentTime}
                </p>

                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                        onClick={() => router.push('/voting/results')}
                    >
                        <Eye size={20} />
                        Xem kết quả
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                        onClick={() => router.push('/')}
                    >
                        <Home size={20} />
                        Quay về trang chủ
                    </button>
                </div>
            </main>

            <BottomNav activeTab="home" />
        </div>
    );
}
