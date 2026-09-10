import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
				secondary:
					'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
				ghost:
					'bg-transparent hover:bg-gray-100 text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
				outline:
					'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800',
				link: 'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400',
				destructive:
					'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-base',
				lg: 'h-12 px-6 text-lg',
				xl: 'h-14 px-8 text-xl',
				icon: 'h-10 w-10',
			},
			fullWidth: {
				true: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	asChild?: boolean;
}

/**
 * Button - A versatile button component with multiple variants
 * Supports loading states, icons, and full width option
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			fullWidth,
			loading,
			disabled,
			leftIcon,
			rightIcon,
			children,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={cn(buttonVariants({ variant, size, fullWidth }), className)}
				disabled={disabled || loading}
				{...props}
			>
				{loading && <Loader2 className="h-4 w-4 animate-spin" />}
				{!loading && leftIcon}
				{children}
				{!loading && rightIcon}
			</button>
		);
	}
);

Button.displayName = 'Button';