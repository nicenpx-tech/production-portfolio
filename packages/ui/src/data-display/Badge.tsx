import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
				primary: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100',
				success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
				warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
				error: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
			},
			size: {
				sm: 'px-2 py-0.5 text-xs',
				md: 'px-2.5 py-0.5 text-xs',
				lg: 'px-3 py-1 text-sm',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
	dot?: boolean;
}

/**
 * Badge - A small label or status indicator
 * Used to display counts, status, or categories
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ variant, size, dot = false, className, children, ...props }, ref) => {
		return (
			<span ref={ref} className={cn(badgeVariants({ variant, size }), 'gap-1', className)} {...props}>
				{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
				{children}
			</span>
		);
	}
);

Badge.displayName = 'Badge';