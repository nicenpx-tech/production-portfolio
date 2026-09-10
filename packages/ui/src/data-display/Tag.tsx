import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { X } from 'lucide-react';

const tagVariants = cva(
	'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
				primary: 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800',
				success: 'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800',
				warning: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800',
				error: 'bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800',
			},
			removable: {
				true: 'pr-1',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
	onRemove?: () => void;
}

/**
 * Tag - A removable label component
 * Used for categories, tags, or filters
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
	({ variant, onRemove, className, children, ...props }, ref) => {
		return (
			<span ref={ref} className={cn(tagVariants({ variant, removable: !!onRemove }), className)} {...props}>
				{children}
				{onRemove && (
					<button
						type="button"
						onClick={onRemove}
						className="ml-1 rounded-full p-0.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-white/5"
					>
						<X className="h-3 w-3" />
					</button>
				)}
			</span>
		);
	}
);

Tag.displayName = 'Tag';