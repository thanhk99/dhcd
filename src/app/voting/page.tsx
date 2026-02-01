'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessHeader } from '@/components/features/Election/ProcessHeader';
import { ShieldCheck } from 'lucide-react';
import { SummaryCards } from '@/components/features/Voting/SummaryCards';
import { ProposalSection } from '@/components/features/Voting/ProposalSection';
import { CumulativeVotingSection } from '@/components/features/Voting/CumulativeVotingSection';
import { meetingService } from '@/services/meetingService';
import { Meeting } from '@/types/meeting';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import { voteService } from '@/services/voteService';
import { Toast } from '@/components/ui/Toast/Toast';
import styles from './VotingPage.module.css';

export default function VotingPage() {
    const router = useRouter();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Voting states
    const [resolutionVotes, setResolutionVotes] = useState<Record<string, string>>({});
    const [boardVotes, setBoardVotes] = useState<Record<string, number>>({});
    const [inspectionVotes, setInspectionVotes] = useState<Record<string, number>>({});

    const fetchData = async () => {
        try {
            const [meetingData, userData] = await Promise.all([
                meetingService.getOngoingMeeting(),
                userService.getCurrentProfile()
            ]);
            setMeeting(meetingData);
            setUser(userData);

            // Extract existing votes from meeting data
            if (meetingData) {
                const resVotes: Record<string, string> = {};
                const bVotes: Record<string, number> = {};
                const iVotes: Record<string, number> = {};
                let vFound = false;

                meetingData.resolutions.forEach(r => {
                    if (r.userVotes && r.userVotes.length > 0) {
                        resVotes[r.id] = r.userVotes[0].votingOptionId;
                        vFound = true;
                    }
                });

                meetingData.elections.forEach(e => {
                    if (e.userVotes && e.userVotes.length > 0) {
                        e.userVotes.forEach(uv => {
                            if (e.electionType === 'BOARD_OF_DIRECTORS') {
                                bVotes[uv.votingOptionId] = uv.voteWeight || 0;
                            } else if (e.electionType === 'SUPERVISORY_BOARD') {
                                iVotes[uv.votingOptionId] = uv.voteWeight || 0;
                            }
                        });
                        vFound = true;
                    }
                });

                setResolutionVotes(resVotes);
                setBoardVotes(bVotes);
                setInspectionVotes(iVotes);
                setHasVoted(vFound);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

    const totalVotingRights = user?.totalShares || 0;
    const sharesOwned = user?.sharesOwned || 0;
    const totalVotingRightsStr = totalVotingRights.toLocaleString('vi-VN');
    const sharesOwnedStr = sharesOwned.toLocaleString('vi-VN');

    const boardElection = meeting?.elections?.find(e => e.electionType === 'BOARD_OF_DIRECTORS');
    const inspectionElection = meeting?.elections?.find(e => e.electionType === 'SUPERVISORY_BOARD');

    const boardCandidates = (boardElection?.votingOptions || []).map(c => ({
        id: c.id,
        name: c.name,
        title: c.position || ''
    }));

    const inspectionCandidates = (inspectionElection?.votingOptions || []).map(c => ({
        id: c.id,
        name: c.name,
        title: c.position || ''
    }));

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Submit Resolution Votes
            const resolutionPromises = Object.entries(resolutionVotes).map(([resId, optionId]) =>
                voteService.voteResolution(resId, {
                    optionVotes: [{ votingOptionId: optionId }]
                })
            );

            // 2. Submit Board Election Votes
            if (boardElection && Object.keys(boardVotes).length > 0) {
                const boardOptionVotes = Object.entries(boardVotes)
                    .filter(([_, weight]) => weight > 0)
                    .map(([optionId, weight]) => ({
                        votingOptionId: optionId,
                        voteWeight: weight
                    }));

                if (boardOptionVotes.length > 0) {
                    resolutionPromises.push(
                        voteService.voteElection(boardElection.id, { optionVotes: boardOptionVotes })
                    );
                }
            }

            // 3. Submit Inspection Election Votes
            if (inspectionElection && Object.keys(inspectionVotes).length > 0) {
                const inspectionOptionVotes = Object.entries(inspectionVotes)
                    .filter(([_, weight]) => weight > 0)
                    .map(([optionId, weight]) => ({
                        votingOptionId: optionId,
                        voteWeight: weight
                    }));

                if (inspectionOptionVotes.length > 0) {
                    resolutionPromises.push(
                        voteService.voteElection(inspectionElection.id, { optionVotes: inspectionOptionVotes })
                    );
                }
            }

            await Promise.all(resolutionPromises);
            await fetchData(); // Refresh data to get newest userVotes from API
            setHasVoted(true);
            router.push('/voting/success');
        } catch (error) {
            console.error('Submit failed:', error);
            setToast({ message: 'Có lỗi xảy ra khi gửi phiếu bầu.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <ProcessHeader
                title={meeting?.title || "Đại hội đồng cổ đông"}
                currentStep={2}
                totalSteps={4}
            />

            <main className={styles.content}>
                <h2 className={styles.pageTitle}>Biểu quyết & Bầu cử</h2>
                <p className={styles.description}>
                    Thực hiện quyền biểu quyết các tờ trình và bầu cử thành viên HĐQT, BKS nhiệm kỳ mới.
                </p>

                <SummaryCards sharesOwned={sharesOwnedStr} votingRights={totalVotingRightsStr} />

                {meeting?.resolutions && meeting.resolutions.length > 0 && (
                    <>
                        <h3 className={styles.sectionTitle}>I. BIỂU QUYẾT CÁC TỜ TRÌNH</h3>
                        <ProposalSection
                            proposals={meeting.resolutions}
                            initialVotes={resolutionVotes}
                            onChange={setResolutionVotes}
                        />
                    </>
                )}

                {boardCandidates.length > 0 && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                            <h3 className={styles.sectionTitle}>{(meeting?.resolutions?.length || 0) > 0 ? 'II' : 'I'}. BẦU CỬ HĐQT</h3>
                            <button style={{ background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-secondary)', fontSize: 12, padding: '4px 8px', borderRadius: 4 }}>
                                Bầu dồn phiếu
                            </button>
                        </div>
                        <CumulativeVotingSection
                            baseRights={totalVotingRights}
                            coefficient={Math.max(1, boardCandidates.length)}
                            candidates={boardCandidates}
                            initialAllocations={boardVotes}
                            onChange={setBoardVotes}
                        />
                    </>
                )}

                {inspectionCandidates.length > 0 && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                            <h3 className={styles.sectionTitle}>
                                {(meeting?.resolutions?.length || 0) > 0 ? (boardCandidates.length > 0 ? 'III' : 'II') : (boardCandidates.length > 0 ? 'II' : 'I')}. BẦU CỬ BAN KIỂM SOÁT
                            </h3>
                            <button style={{ background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-secondary)', fontSize: 12, padding: '4px 8px', borderRadius: 4 }}>
                                Bầu dồn phiếu
                            </button>
                        </div>
                        <CumulativeVotingSection
                            baseRights={totalVotingRights}
                            coefficient={Math.max(1, inspectionCandidates.length)}
                            candidates={inspectionCandidates}
                            initialAllocations={inspectionVotes}
                            onChange={setInspectionVotes}
                        />
                    </>
                )}

                {(!meeting?.resolutions || meeting.resolutions.length === 0) && boardCandidates.length === 0 && inspectionCandidates.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        Không có nội dung bầu cử hoặc biểu quyết nào hiện khả dụng.
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <div className={styles.authNotice}>
                    <ShieldCheck size={14} color="var(--text-secondary)" />
                    <span>Bảo mật xác thực qua FaceID/TouchID khi gửi</span>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.draftBtn}>Lưu nháp</button>
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Đang gửi...' : (hasVoted ? 'Thay đổi phiếu bầu' : 'Gửi phiếu bầu')}
                    </button>
                </div>
            </footer>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
