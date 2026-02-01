import React from 'react';
import styles from './AgendaSection.module.css';

interface AgendaItemProps {
    index: number;
    title: string;
    description: string;
    onClick: () => void;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ index, title, description, onClick }) => {
    return (
        <div className={styles.item} onClick={onClick}>
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
    onViewDetail: (item: { title: string; description: string }) => void;
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({ items = [], onViewDetail }) => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>Nội dung nghị trình</h3>
                {items.length > 0 && (
                    <button
                        className={styles.detailButton}
                        onClick={() => onViewDetail(items[0])} // Default to first item or generic detail
                    >
                        Chi tiết
                    </button>
                )}
            </div>
            {items.length > 0 ? (
                <div className={styles.list}>
                    {items.map((item, index) => (
                        <AgendaItem
                            key={index}
                            index={index + 1}
                            title={item.title}
                            description={item.description}
                            onClick={() => onViewDetail(item)}
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
