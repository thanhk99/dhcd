'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './NotificationModal.module.css';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    children
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Thông báo</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>
                <div className={styles.content}>
                    <div className={styles.list}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
