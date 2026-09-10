import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const dividerVariants = cva('border-gray-200 dark:border-gray-800', {
	variants: {
		orientation: {
			horizontal: 'w-full border-t',
			vertical: 'h-full border-l',
		},
		variant: {
			solid: 'border-solid',
			dashed: 'border-dashed',
			dotted: 'border-dotted',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
		variant: 'solid',
	},
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {
	label?: string;
}

/**
 * Divider - A visual separator component
 * Can be horizontal or vertical with optional label
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
	({ className, orientation, variant, label, ...props }, ref) => {
		if (label && orientation === 'horizontal') {
			return (
				<div ref={ref} className={cn('flex items-center gap-4', className)} {...props}>
					<div className={cn('flex-1', dividerVariants({ orientation, variant }))} />
					<span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
					<div className={cn('flex-1', dividerVariants({ orientation, variant }))} />
				</div>
			);
		}

		return (
			<div ref={ref} className={cn(dividerVariants({ orientation, variant }), className)} {...props} />
		);
	}
);

Divider.displayName = 'Divider';