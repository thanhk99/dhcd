'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './ProcessHeader.module.css';

interface ProcessHeaderProps {
    title: string;
    currentStep: number;
    totalSteps: number;
    onBack?: () => void;
    onCancel?: () => void;
}

export const ProcessHeader: React.FC<ProcessHeaderProps> = ({
    title,
    currentStep,
    totalSteps,
    onBack,
    onCancel
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.push('/');
        }
    };

    return (
        <div className={styles.headerContainer}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={handleBack} aria-label="Quay lại">
                    <ArrowLeft size={24} />
                </button>
                <h1 className={styles.title}>{title}</h1>
                <button className={styles.cancelBtn} onClick={handleCancel}>Huỷ</button>
            </header>

            <div className={styles.stepper}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index + 1 === currentStep ? styles.dotActive : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};
