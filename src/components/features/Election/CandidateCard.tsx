import styles from './CandidateCard.module.css';
import { VotingOption } from '@/types/meeting';

interface CandidateCardProps {
    name: string;
    position: string | null;
    imageUrl: string | null;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ name, position, imageUrl }) => {
    const defaultImage = 'https://i.pravatar.cc/150?u=default';
    return (
        <div className={styles.card}>
            <div className={styles.avatarWrapper}>
                <img src={imageUrl || defaultImage} alt={name} className={styles.avatar} />
            </div>
            <h4 className={styles.name}>{name}</h4>
            <p className={styles.position}>{position || 'Chưa xác định'}</p>
            <button className={styles.profileButton}>Hồ sơ</button>
        </div>
    );
};

interface CandidatesListProps {
    candidates?: VotingOption[];
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates = [] }) => {
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
                        name={candidate.name}
                        position={candidate.position}
                        imageUrl={candidate.photoUrl}
                    />
                ))}
            </div>
        </section>
    );
};
