'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import styles from './VotingAction.module.css';

interface VotingActionProps {
    shares: string;
}

export const VotingAction: React.FC<VotingActionProps> = ({ shares }) => {
    const router = useRouter();

    return (
        <div className={styles.stickyContainer}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <span className={styles.label}>SỐ PHIẾU CỦA BẠN</span>
                    <span className={styles.value}>{shares} CP</span>
                </div>
                <button className={styles.button} onClick={() => router.push('/voting')}>
                    <Send size={18} />
                    <span>Tiến hành Bỏ phiếu</span>
                </button>
            </div>
        </div>
    );
};
