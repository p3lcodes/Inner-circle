import React from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white shadow-sm border border-[var(--color-accent-500)]',
            secondary: 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)]',
            outline: 'bg-transparent hover:bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)]',
            ghost: 'bg-transparent hover:bg-[var(--color-surface-hover)] text-neutral-300',
            danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2 text-sm',
            lg: 'h-12 px-6 text-base',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';
