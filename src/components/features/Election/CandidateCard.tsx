import React from 'react';
import styles from './CandidateCard.module.css';
import { VotingOption } from '@/types/meeting';

interface CandidateCardProps {
    candidate: VotingOption;
    onViewProfile: (candidate: VotingOption) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewProfile }) => {
    const defaultImage = 'https://i.pravatar.cc/150?u=default';
    const { name, position, photoUrl } = candidate;

    return (
        <div className={styles.card}>
            <div className={styles.avatarWrapper}>
                <img src={photoUrl || defaultImage} alt={name} className={styles.avatar} />
            </div>
            <h4 className={styles.name}>{name}</h4>
            <p className={styles.position}>{position || 'Chưa xác định'}</p>
            <button
                className={styles.profileButton}
                onClick={() => onViewProfile(candidate)}
            >
                Hồ sơ
            </button>
        </div>
    );
};

interface CandidatesListProps {
    candidates?: VotingOption[];
    onViewProfile: (candidate: VotingOption) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates = [], onViewProfile }) => {
    if (candidates.length === 0) {
        return (
            <section className={styles.section}>
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Chưa có danh sách ứng viên.
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.scrollContainer}>
                {candidates.map((candidate, index) => (
                    <CandidateCard
                        key={candidate.id || index}
                        candidate={candidate}
                        onViewProfile={onViewProfile}
                    />
                ))}
            </div>
        </section>
    );
};
