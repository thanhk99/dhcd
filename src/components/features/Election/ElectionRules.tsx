import React from 'react';
import { Gavel, ChevronRight } from 'lucide-react';
import styles from './ElectionRules.module.css';

export const ElectionRules: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <Gavel size={24} className={styles.icon} />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>Quy tắc bầu cử</h3>
                    <p className={styles.description}>
                        Cuộc bầu cử áp dụng nguyên tắc bầu dồn phiếu. Cổ đông có quyền dồn hết phiếu bầu cho một hoặc một số ứng cử viên.
                    </p>
                    <button className={styles.linkButton}>
                        Xem quy chế đầy đủ <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};
