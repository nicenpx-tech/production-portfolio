import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const textVariants = cva('', {
	variants: {
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			base: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
		},
		weight: {
			thin: 'font-thin',
			extralight: 'font-extralight',
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
			extrabold: 'font-extrabold',
		},
		color: {
			default: 'text-gray-900 dark:text-gray-100',
			muted: 'text-gray-500 dark:text-gray-400',
			primary: 'text-indigo-600 dark:text-indigo-400',
			success: 'text-green-600 dark:text-green-400',
			error: 'text-red-600 dark:text-red-400',
			warning: 'text-yellow-600 dark:text-yellow-400',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify',
		},
		truncate: {
			true: 'truncate',
		},
	},
	defaultVariants: {
		size: 'base',
		color: 'default',
		align: 'left',
	},
});

export interface TextProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>, VariantProps<typeof textVariants> {
	asChild?: boolean;
	as?: React.ElementType;
}

/**
 * Text - A typography primitive for all text elements
 * Provides consistent styling with size, weight, color variants
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	({ className, size, weight, color, align, truncate, as: Component = 'p', ...props }, ref) => {
		return (
			<Component
				ref={ref}
				className={cn(textVariants({ size, weight, color, align, truncate }), className)}
				{...props}
			/>
		);
	}
);

Text.displayName = 'Text';