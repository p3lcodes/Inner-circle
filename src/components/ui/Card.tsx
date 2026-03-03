import React from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    animate?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, animate = false, ...props }, ref) => {
        const Component = animate ? motion.div : 'div';
        const motionProps = animate
            ? {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3 },
            }
            : {};

        return (
            <Component
                ref={ref}
                className={cn(
                    'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm',
                    className
                )}
                {...(motionProps as any)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);
Card.displayName = 'Card';

export const CardHeader = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
);

export const CardTitle = ({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('text-lg font-semibold tracking-tight text-[var(--color-text-main)]', className)}>
        {children}
    </h3>
);
