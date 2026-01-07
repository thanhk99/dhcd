'use client';

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.icon}>
                {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </span>
            <p>{message}</p>
            <button className={styles.closeButton} onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};
