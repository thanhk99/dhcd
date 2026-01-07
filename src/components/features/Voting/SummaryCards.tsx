import React from 'react';
import { PieChart, Users } from 'lucide-react';
import styles from './SummaryCards.module.css';

interface SummaryCardsProps {
    sharesOwned: string;
    votingRights: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ sharesOwned, votingRights }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <PieChart className={styles.icon} size={20} />
                </div>
                <div className={styles.value}>{sharesOwned}</div>
                <div className={styles.label}>Cổ phần sở hữu</div>
            </div>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <Users className={styles.icon} size={20} />
                </div>
                <div className={styles.value}>{votingRights}</div>
                <div className={styles.label}>Quyền biểu quyết</div>
            </div>
        </div>
    );
};
