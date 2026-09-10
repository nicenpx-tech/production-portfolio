import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const headingVariants = cva('font-bold text-gray-900 dark:text-gray-100', {
	variants: {
		size: {
			h1: 'text-4xl',
			h2: 'text-3xl',
			h3: 'text-2xl',
			h4: 'text-xl',
			h5: 'text-lg',
			h6: 'text-base',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify',
		},
	},
	defaultVariants: {
		size: 'h2',
		align: 'left',
	},
});

export interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Heading - A typography primitive for semantic headings
 * Renders the tag from `as` or falls back to the matching `size` variant
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, size, align, as, ...props }, ref) => {
		const Component = (as || size) as React.ElementType;

		return (
			<Component
				ref={ref}
				className={cn(headingVariants({ size, align }), className)}
				{...props}
			/>
		);
	}
);

Heading.displayName = 'Heading';
