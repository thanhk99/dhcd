'use client';

import React, { useEffect, useState } from 'react';

import { ProcessHeader } from '@/components/features/Election/ProcessHeader';
import { ElectionBanner } from '@/components/features/Election/ElectionBanner';
import { TimeInfo } from '@/components/features/Election/TimeInfo';
import { AgendaSection } from '@/components/features/Election/AgendaSection';
import { CandidatesList } from '@/components/features/Election/CandidateCard';
import { ElectionRules } from '@/components/features/Election/ElectionRules';
import { VotingAction } from '@/components/features/Election/VotingAction';
import { meetingService } from '@/services/meetingService';
import { userService } from '@/services/userService';
import { Meeting } from '@/types/meeting';
import { User } from '@/types/user';
import styles from './election-detail.module.css';

export default function ElectionDetailPage() {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meetingData, userData] = await Promise.all([
                    meetingService.getOngoingMeeting(),
                    userService.getCurrentProfile()
                ]);
                setMeeting(meetingData);
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Simple countdown helper
    const getCountdown = (start: string) => {
        const now = new Date();
        const startDate = new Date(start);
        const diff = startDate.getTime() - now.getTime();

        if (diff <= 0) return 'Đang diễn ra';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `Còn ${days} ngày ${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <main className={styles.main}>
            {/* Step 1 of 4: Detail View */}
            <ProcessHeader
                title={meeting?.title || 'Đại hội đồng cổ đông'}
                currentStep={1}
                totalSteps={4}
            />

            <div className={styles.content}>
                <ElectionBanner
                    status={meeting?.status === 'ONGOING' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                    timeLeft={meeting ? getCountdown(meeting.startTime) : '...'}
                    title={meeting?.title || 'Đang tải thông tin...'}
                    description={meeting?.description || ''}
                />

                <TimeInfo
                    startTime={meeting?.startTime}
                    endTime={meeting?.endTime}
                />

                <AgendaSection
                    items={meeting?.resolutions?.map(r => ({
                        title: r.title,
                        description: r.description || ''
                    }))}
                />



                {meeting?.elections && meeting.elections.length > 0 && (
                    <CandidatesList candidates={meeting.elections[0].votingOptions} />
                )}

                <ElectionRules />

                <section className={styles.section} style={{ marginBottom: '40px' }}>
                    <h3 className={styles.sectionTitle}>GÓP Ý & CÂU HỎI</h3>
                    <textarea
                        className={styles.feedbackInput}
                        placeholder="Nhập ý kiến đóng góp hoặc câu hỏi của bạn cho đoàn chủ tịch..."
                    />
                    <button className={styles.feedbackBtn}>Gửi ý kiến</button>
                </section>
            </div>

            <VotingAction shares={((user?.sharesOwned || 0) + (user?.receivedProxyShares || 0)).toLocaleString('vi-VN')} />
        </main>
    );
}
