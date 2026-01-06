import React from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    fullWidth = false,
    ...props
}) => {
    return (
        <button
            className={cn(
                styles.button,
                styles[variant],
                fullWidth && styles.fullWidth,
                className
            )}
            {...props}
        >
            {children}
        </button >
    );
};
