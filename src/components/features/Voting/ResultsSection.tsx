import React from 'react';
import { VotingResult } from '@/services/voteService';
import { Users, BarChart3 } from 'lucide-react';
import styles from './ResultsSection.module.css';

interface ResultsSectionProps {
    title: string;
    result: VotingResult;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ title, result }) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Users size={16} />
                        <span>Tổng số người bầu: {result.totalVoters}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <BarChart3 size={16} />
                        <span>Tổng quyền biểu quyết: {formatNumber(result.totalWeight)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.optionsList}>
                {result.results.sort((a, b) => b.percentage - a.percentage).map((option) => (
                    <div key={option.votingOptionId} className={styles.optionItem}>
                        <div className={styles.optionHeader}>
                            <span className={styles.optionName}>{option.votingOptionName}</span>
                            <span className={styles.optionPercentage}>{option.percentage}%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${option.percentage}%` }}
                            />
                        </div>
                        <div className={styles.optionFooter}>
                            <span>{formatNumber(option.totalWeight)} phiếu</span>
                            <span>{option.voteCount} người chọn</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
