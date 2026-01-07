'use client';

import React from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    rightIcon,
    onRightIconClick,
    error,
    className,
    ...props
}) => {
    return (
        <div className={cn(styles.inputWrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={cn(styles.fieldContainer, error && styles.fieldError)}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input className={styles.input} {...props} />
                {rightIcon && (
                    <span
                        className={cn(styles.rightIcon, onRightIconClick && styles.clickableIcon)}
                        onClick={onRightIconClick}
                    >
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
