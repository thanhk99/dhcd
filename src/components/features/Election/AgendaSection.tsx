import React from 'react';
import styles from './AgendaSection.module.css';

interface AgendaItemProps {
    index: number;
    title: string;
    description: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ index, title, description }) => {
    return (
        <div className={styles.item}>
            <div className={styles.number}>{index}</div>
            <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>{title}</h4>
                <p className={styles.itemDescription}>{description}</p>
            </div>
        </div>
    );
};

interface AgendaSectionProps {
    items?: { title: string; description: string }[];
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({ items = [] }) => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>Nội dung nghị trình</h3>
                <button className={styles.detailButton}>Chi tiết</button>
            </div>
            {items.length > 0 ? (
                <div className={styles.list}>
                    {items.map((item, index) => (
                        <AgendaItem
                            key={index}
                            index={index + 1}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Chưa có nội dung nghị trình.
                </div>
            )}
        </section>
    );
};
