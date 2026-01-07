import React, { useState, useMemo } from 'react';
import { User, Minus, Plus } from 'lucide-react';
import styles from './CumulativeVotingSection.module.css';

interface Candidate {
    id: string;
    name: string;
    title: string;
}

interface CumulativeVotingSectionProps {
    baseRights: number;
    coefficient: number;
    candidates: Candidate[];
    initialAllocations?: Record<string, number>;
    onChange?: (allocations: Record<string, number>) => void;
}

export const CumulativeVotingSection: React.FC<CumulativeVotingSectionProps> = ({
    baseRights,
    coefficient,
    candidates,
    initialAllocations = {},
    onChange
}) => {
    const totalVotes = baseRights * coefficient;
    const [allocations, setAllocations] = useState<Record<string, number>>(() => {
        const initial = Object.fromEntries(candidates.map(c => [c.id, 0]));
        return { ...initial, ...initialAllocations };
    });

    React.useEffect(() => {
        if (Object.keys(initialAllocations).length > 0) {
            setAllocations(prev => ({ ...prev, ...initialAllocations }));
        }
    }, [initialAllocations]);

    const allocated = useMemo(() => {
        return Object.values(allocations).reduce((sum, val) => sum + val, 0);
    }, [allocations]);

    const remaining = totalVotes - allocated;
    const progress = (allocated / totalVotes) * 100;

    const handleUpdate = (id: string, value: number) => {
        const newValue = Math.max(0, value);
        const difference = newValue - allocations[id];

        let updatedAllocations;
        // If adding more than remaining, cap it
        if (difference > 0 && difference > remaining) {
            updatedAllocations = { ...allocations, [id]: allocations[id] + remaining };
        } else {
            updatedAllocations = { ...allocations, [id]: newValue };
        }

        setAllocations(updatedAllocations);
        if (onChange) {
            onChange(updatedAllocations);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div className={styles.section}>
            <div className={styles.summary}>
                <span className={styles.summaryLabel}>Tổng phiếu bầu (Hệ số {coefficient}):</span>
                <span className={styles.summaryValue}>{formatNumber(totalVotes)}</span>
            </div>

            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${Math.min(100, progress)}%` }} />
            </div>

            <div className={styles.allocationInfo}>
                <div className={styles.allocated}>
                    <div className={styles.allocatedDot} />
                    <span>Đã phân bổ: {formatNumber(allocated)}</span>
                </div>
                <div className={styles.remaining}>Còn lại {formatNumber(remaining)}</div>
            </div>

            <div className={styles.candidateList}>
                {candidates.map((candidate, index) => (
                    <React.Fragment key={candidate.id}>
                        <div className={styles.candidateItem}>
                            <div className={styles.candidateInfo}>
                                <div className={styles.avatar}>
                                    <User size={24} />
                                </div>
                                <div className={styles.nameTitle}>
                                    <div className={styles.name}>{candidate.name}</div>
                                    <div className={styles.title}>{candidate.title}</div>
                                </div>
                            </div>

                            <div className={styles.controls}>
                                <button
                                    className={styles.controlBtn}
                                    onClick={() => handleUpdate(candidate.id, allocations[candidate.id] - 100)}
                                >
                                    <Minus size={20} />
                                </button>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={allocations[candidate.id]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                                            handleUpdate(candidate.id, val);
                                        }}
                                    />
                                </div>
                                <button
                                    className={styles.controlBtn}
                                    onClick={() => handleUpdate(candidate.id, allocations[candidate.id] + 100)}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                        {index < candidates.length - 1 && <div className={styles.divider} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
