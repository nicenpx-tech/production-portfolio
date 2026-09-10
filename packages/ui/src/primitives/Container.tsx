import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const containerVariants = cva('w-full mx-auto px-4 sm:px-6 lg:px-8', {
	variants: {
		size: {
			sm: 'max-w-sm',
			md: 'max-w-md',
			lg: 'max-w-lg',
			xl: 'max-w-xl',
			'2xl': 'max-w-2xl',
			'3xl': 'max-w-3xl',
			'4xl': 'max-w-4xl',
			'5xl': 'max-w-5xl',
			'6xl': 'max-w-6xl',
			'7xl': 'max-w-7xl',
			full: 'max-w-full',
			none: '',
		},
	},
	defaultVariants: {
		size: '7xl',
	},
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
	centered?: boolean;
}

/**
 * Container - A responsive container primitive
 * Provides consistent max-width and padding across breakpoints
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	({ className, size, centered, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(containerVariants({ size }), centered && 'mx-auto', className)}
				{...props}
			/>
		);
	}
);

Container.displayName = 'Container';