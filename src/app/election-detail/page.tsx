'use client';

import React, { useEffect, useState } from 'react';

import { ProcessHeader } from '@/components/features/Election/ProcessHeader';
import { ElectionBanner } from '@/components/features/Election/ElectionBanner';
import { TimeInfo } from '@/components/features/Election/TimeInfo';
import { AgendaSection } from '@/components/features/Election/AgendaSection';
import { CandidatesList } from '@/components/features/Election/CandidateCard';
import { ElectionRules } from '@/components/features/Election/ElectionRules';
import { VotingAction } from '@/components/features/Election/VotingAction';
import { Modal } from '@/components/ui/Modal/Modal';
import { meetingService } from '@/services/meetingService';
import { userService } from '@/services/userService';
import { Meeting, VotingOption } from '@/types/meeting';
import { User } from '@/types/user';
import styles from './election-detail.module.css';

export default function ElectionDetailPage() {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [selectedCandidate, setSelectedCandidate] = useState<VotingOption | null>(null);
    const [selectedResolution, setSelectedResolution] = useState<{ title: string; description: string } | null>(null);

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
                    image="/meeting-banner.png"
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
                    onViewDetail={setSelectedResolution}
                />

                {meeting?.elections && meeting.elections.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {meeting.elections.map((election, index) => (
                            <section key={election.id || index} className={styles.section}>
                                <h3 className={styles.sectionTitle}>{election.title}</h3>
                                <CandidatesList
                                    candidates={election.votingOptions}
                                    onViewProfile={setSelectedCandidate}
                                />
                            </section>
                        ))}
                    </div>
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

            {/* Candidate Profile Modal */}
            <Modal
                isOpen={!!selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                title="Hồ sơ ứng viên"
            >
                {selectedCandidate && (
                    <div className={styles.modalProfile}>
                        <div className={styles.modalAvatarWrapper}>
                            <img
                                src={selectedCandidate.photoUrl || 'https://i.pravatar.cc/150?u=default'}
                                alt={selectedCandidate.name}
                                className={styles.modalAvatar}
                            />
                        </div>
                        <h3 className={styles.modalName}>{selectedCandidate.name}</h3>
                        <p className={styles.modalPosition}>{selectedCandidate.position || 'Chưa xác định'}</p>
                        <div className={styles.modalDivider} />
                        <div className={styles.modalBio}>
                            <h4>Tiểu sử và Kinh nghiệm</h4>
                            <p>{selectedCandidate.bio || 'Chưa có thông tin tiểu sử chi tiết.'}</p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Resolution Detail Modal */}
            <Modal
                isOpen={!!selectedResolution}
                onClose={() => setSelectedResolution(null)}
                title="Chi tiết Nghị trình"
            >
                {selectedResolution && (
                    <div className={styles.modalResolution}>
                        <h3 className={styles.modalResTitle}>{selectedResolution.title}</h3>
                        <div className={styles.modalDivider} />
                        <div className={styles.modalResDescription}>
                            <p>{selectedResolution.description || 'Chưa có thông tin chi tiết cho nghị trình này.'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </main>
    );
}
