import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 min-w-0 w-full">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-text-main)]">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-main)] transition-colors',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-neutral-500',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-500)] focus-visible:border-[var(--color-accent-500)]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus-visible:ring-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
