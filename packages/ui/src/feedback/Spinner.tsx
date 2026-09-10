import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-transparent', {
	variants: {
		size: {
			sm: 'h-4 w-4 border-t-current',
			md: 'h-6 w-6 border-t-current',
			lg: 'h-8 w-8 border-t-current',
			xl: 'h-12 w-12 border-t-current',
		},
		color: {
			default: 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400',
			primary: 'border-indigo-200 text-indigo-600 dark:border-indigo-900 dark:text-indigo-400',
			white: 'border-gray-300 text-white',
		},
	},
	defaultVariants: {
		size: 'md',
		color: 'default',
	},
});

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof spinnerVariants> {
	label?: string;
}

/**
 * Spinner - A loading indicator component
 * Shows a spinning animation while content is loading
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
	({ size, color, label, className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
				<div className={cn(spinnerVariants({ size, color }))} role="status" aria-label={label || 'Loading'} />
				{label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>}
			</div>
		);
	}
);

Spinner.displayName = 'Spinner';